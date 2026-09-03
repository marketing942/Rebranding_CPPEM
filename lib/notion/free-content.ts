import "server-only";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion/client";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import type { FreeMaterial, VerticalizedNotice } from "@/types/free-content";

type Properties = Record<string, unknown>;
type BaseItem = Omit<FreeMaterial, "label" | "description">;

function readFileUrl(value: unknown) {
  const files = (value as { files?: Array<{ external?: { url?: string }; file?: { url?: string } }> } | undefined)?.files;
  return files?.[0]?.external?.url ?? files?.[0]?.file?.url ?? "";
}

async function fetchLibrary<T>(databaseId: string | undefined, map: (base: BaseItem, properties: Properties) => T): Promise<T[]> {
  if (!notion || !databaseId) return [];
  try {
    const dataSourceId = await resolveDataSourceId(databaseId);
    if (!dataSourceId) return [];
    const items: T[] = [];
    let cursor: string | undefined;
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: "Status", select: { equals: "Ativo" } },
        start_cursor: cursor,
        page_size: 100,
      });
      for (const page of response.results) {
        const properties = (page as { properties?: Properties }).properties;
        if (!properties) continue;
        const name = plainText((properties.Nome as { title?: unknown })?.title);
        const href = readUrl(properties.Link) || readFileUrl(properties.Arquivo);
        if (!name || !href || !isSafeWebUrl(href)) continue;
        const image = readUrl(properties.Imagem);
        items.push(map({
          id: (page as { id: string }).id,
          name,
          href,
          imageUrl: image && isSafeWebUrl(image) ? image : null,
          menuFeatured: readCheckbox(properties["Destaque no menu"]),
          menuOrder: readNumber(properties["Ordem no menu"]),
        }, properties));
      }
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    return items;
  } catch (error) {
    console.error("[free-content] Falha ao carregar biblioteca do Notion:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

async function fetchMaterials() {
  return fetchLibrary<FreeMaterial>(process.env.NOTION_MATERIAIS_DATABASE_ID, (base, properties) => ({
    ...base,
    label: plainText((properties["Título"] as { rich_text?: unknown })?.rich_text),
    description: plainText((properties["Descrição Curta"] as { rich_text?: unknown })?.rich_text),
  }));
}

async function fetchNotices() {
  const items = await fetchLibrary<VerticalizedNotice>(process.env.NOTION_EDITAIS_DATABASE_ID, (base, properties) => ({
    ...base,
    label: "Edital verticalizado",
    description: plainText((properties["Descrição Curta"] as { rich_text?: unknown })?.rich_text),
    agency: readSelect(properties["Órgão"]),
    role: plainText((properties.Cargo as { rich_text?: unknown })?.rich_text),
    board: plainText((properties.Banca as { rich_text?: unknown })?.rich_text),
    year: readNumber(properties.Ano),
  }));
  return items.sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity) || a.name.localeCompare(b.name, "pt-BR"));
}

export const getFreeMaterials = unstable_cache(fetchMaterials, ["free-materials"], { revalidate: 300, tags: ["materiais"] });
export const getVerticalizedNotices = unstable_cache(fetchNotices, ["verticalized-notices"], { revalidate: 300, tags: ["editais"] });
