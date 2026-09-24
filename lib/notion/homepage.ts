import "server-only";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion/client";
import { semDuplicar } from "@/lib/notion/inflight";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import type { CampaignBanner, Product } from "@/types/content";

type ScheduledBanner = CampaignBanner & {
  startsAt: number | null;
  endsAt: number | null;
  order: number;
};

function dateLimit(value: unknown, end: boolean): number | null {
  const date = (value as { date?: { start?: string; end?: string } } | undefined)?.date;
  const iso = end ? (date?.end ?? date?.start) : date?.start;
  if (!iso) return null;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const timestamp = new Date(dateOnly && end ? `${iso}T23:59:59` : iso).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

async function lerBanners(): Promise<CampaignBanner[] | null> {
  const databaseId = process.env.NOTION_BANNERS_DATABASE_ID;
  if (!notion || !databaseId) return null;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, notion);
    if (!dataSourceId) return [];
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Status", select: { equals: "Ativo" } },
    });

    const scheduled: ScheduledBanner[] = [];
    for (const page of response.results) {
      const properties = (page as { properties?: Record<string, unknown> }).properties;
      if (!properties) continue;
      const desktopUrl = readUrl(properties["Banner desktop"]);
      const href = readUrl(properties.Link);
      if (!isSafeWebUrl(desktopUrl) || !href) continue;

      scheduled.push({
        id: (page as { id: string }).id,
        name: plainText((properties.Nome as { title?: unknown })?.title) || "Campanha CPPEM",
        desktopUrl,
        mobileUrl: readUrl(properties["Banner mobile"]) || null,
        href,
        ctaLabel: plainText((properties["Texto do botão"] as { rich_text?: unknown })?.rich_text),
        callout: plainText((properties.Chamada as { rich_text?: unknown })?.rich_text),
        startsAt: dateLimit(properties["Início"], false),
        endsAt: dateLimit(properties.Fim, true),
        order: readNumber(properties.Ordem) ?? Number.MAX_SAFE_INTEGER,
      });
    }

    const now = Date.now();
    return scheduled
      .filter(({ startsAt, endsAt }) => (startsAt === null || now >= startsAt) && (endsAt === null || now <= endsAt))
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"))
      .map((banner) => ({
        id: banner.id,
        name: banner.name,
        desktopUrl: banner.desktopUrl,
        mobileUrl: banner.mobileUrl,
        ctaLabel: banner.ctaLabel,
        callout: banner.callout,
        href: banner.href,
      }));
  } catch (error) {
    console.error("[notion] Falha ao carregar banners:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

async function lerProdutos(): Promise<Product[] | null> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!notion || !databaseId) return null;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, notion);
    if (!dataSourceId) return [];
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Status", select: { equals: "Ativo" } },
    });

    const products: Product[] = [];
    for (const page of response.results) {
      const properties = (page as { properties?: Record<string, unknown> }).properties;
      if (!properties) continue;
      const name = plainText((properties.Nome as { title?: unknown })?.title);
      const href = readUrl(properties.Link);
      const imageUrl = readUrl(properties.Imagem);
      const homepageVisibility = properties["Exibir na Homepage"];
      if (readSelect(properties.Status) !== "Ativo" || (homepageVisibility && !readCheckbox(homepageVisibility)) || !name || !href || !isSafeWebUrl(imageUrl)) continue;

      products.push({
        id: (page as { id: string }).id,
        slug: (page as { id: string }).id.replaceAll("-", ""),
        name,
        category: plainText((properties["Título"] as { rich_text?: unknown })?.rich_text) || "Preparação CPPEM",
        modality: "",
        description: plainText((properties["Descrição Curta"] as { rich_text?: unknown })?.rich_text),
        price: plainText((properties["Preço"] as { rich_text?: unknown })?.rich_text),
        oldPrice: plainText((properties["Preço antigo"] as { rich_text?: unknown })?.rich_text) || null,
        imageUrl,
        href,
      });
    }
    return products;
  } catch (error) {
    console.error("[notion] Falha ao carregar a vitrine:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

export const getNotionBanners = unstable_cache(
  () => semDuplicar("notion-banners", lerBanners),
  ["notion-banners"],
  { revalidate: 300, tags: ["banners"] },
);

export const getNotionProducts = unstable_cache(
  () => semDuplicar("notion-products", lerProdutos),
  ["notion-products"],
  { revalidate: 300, tags: ["vitrine"] },
);
