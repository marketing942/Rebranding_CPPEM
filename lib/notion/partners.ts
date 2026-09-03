import "server-only";
import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import { normalizePartnerKey, type Partner } from "@/lib/partners";

const token = process.env.NOTION_PARCEIROS_TOKEN ?? process.env.NOTION_TOKEN;
const partnerNotion = token ? new Client({ auth: token }) : null;

function safeUrl(value: unknown) {
  const url = readUrl(value);
  return url && isSafeWebUrl(url) ? url : null;
}

async function fetchPartners(): Promise<Partner[]> {
  const databaseId = process.env.NOTION_PARCEIROS_DATABASE_ID;
  if (!partnerNotion || !databaseId) return [];

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, partnerNotion);
    if (!dataSourceId) return [];

    const rows: Array<{ partner: Partner; order: number }> = [];
    let cursor: string | undefined;

    do {
      const response = await partnerNotion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: "Status", select: { equals: "Ativo" } },
        start_cursor: cursor,
        page_size: 100,
      });

      for (const page of response.results) {
        const props = (page as { properties?: Record<string, unknown> }).properties;
        if (!props) continue;
        const name = plainText((props.Nome as { title?: unknown })?.title);
        if (!name) continue;
        const category = readSelect(props.Categoria);
        const label = plainText((props["Rótulo"] as { rich_text?: unknown })?.rich_text);

        rows.push({
          partner: {
            id: (page as { id: string }).id,
            name,
            categoryKey: normalizePartnerKey(category),
            categoryLabel: label || category || "Parceiro CPPEM",
            description: plainText((props["Descrição"] as { rich_text?: unknown })?.rich_text),
            benefit: plainText((props["Benefício"] as { rich_text?: unknown })?.rich_text),
            whatsappUrl: safeUrl(props.WhatsApp),
            instagramUrl: safeUrl(props.Instagram),
            logoUrl: safeUrl(props.Logo),
            featured: readCheckbox(props.Destaque),
          },
          order: readNumber(props.Ordem) ?? Number.MAX_SAFE_INTEGER,
        });
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return rows
      .sort((a, b) => Number(b.partner.featured) - Number(a.partner.featured) || a.order - b.order || a.partner.name.localeCompare(b.partner.name, "pt-BR"))
      .map(({ partner }) => partner);
  } catch (error) {
    console.error("[partners] Falha ao carregar parceiros do Notion:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

export const getPartners = unstable_cache(fetchPartners, ["cppem-partners"], {
  revalidate: 300,
  tags: ["parceiros"],
});

export async function createPartnerProposalInNotion(proposal: {
  company: string;
  categoryLabel: string | null;
  contact: string;
  whatsapp: string;
  benefit: string;
  logoUrl: string | null;
}) {
  const databaseId = process.env.NOTION_PARCEIROS_DATABASE_ID;
  if (!partnerNotion || !databaseId) return false;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, partnerNotion);
    if (!dataSourceId) return false;
    await partnerNotion.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties: {
        Nome: { title: [{ text: { content: proposal.company } }] },
        ...(proposal.categoryLabel ? { Categoria: { select: { name: proposal.categoryLabel } } } : {}),
        ...(proposal.benefit ? { "Benefício": { rich_text: [{ text: { content: proposal.benefit } }] } } : {}),
        "Responsável": { rich_text: [{ text: { content: `${proposal.contact} — ${proposal.whatsapp}` } }] },
        ...(proposal.logoUrl ? { Logo: { url: proposal.logoUrl } } : {}),
        Status: { select: { name: "Novo" } },
      },
    });
    return true;
  } catch (error) {
    console.error("[partners] Falha ao criar triagem no Notion:", error instanceof Error ? error.message : "erro desconhecido");
    return false;
  }
}
