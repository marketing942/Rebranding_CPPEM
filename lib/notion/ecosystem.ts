import "server-only";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion/client";
import { plainText, readCheckbox, readNumber, readSelect, resolveDataSourceId } from "@/lib/notion/properties";
import type { EcosystemItem } from "@/types/ecosystem";

type Properties = Record<string, unknown>;

const fallbackItems: EcosystemItem[] = [
  { id: "mentoria-individual", name: "Mentoria individual", description: "Estratégia individual para rotina, método e concurso.", href: "https://individual.cppem.com.br", category: "Mentoria", icon: "Alvo", label: "", featured: true, order: 1, newTab: true },
  { id: "faculdade-ead", name: "Faculdade EAD", description: "Formação superior a distância para avançar na carreira.", href: "https://contato.unicive.cppem.com.br", category: "Formação", icon: "Graduação", label: "", featured: true, order: 2, newTab: true },
  { id: "supletivo", name: "Supletivo", description: "Conclusão da escolaridade para liberar o próximo passo.", href: "https://supletivo.cppem.com.br", category: "Formação", icon: "Diploma", label: "", featured: true, order: 3, newTab: true },
];

function validHref(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

async function fetchEcosystemItems(): Promise<EcosystemItem[]> {
  const databaseId = process.env.NOTION_ECOSYSTEM_DATABASE_ID;
  if (!notion || !databaseId) return fallbackItems;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId);
    if (!dataSourceId) return fallbackItems;
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Ativo", checkbox: { equals: true } },
      sorts: [{ property: "Ordem", direction: "ascending" }],
      page_size: 100,
    });

    const items = response.results.flatMap((page) => {
      const properties = (page as { properties?: Properties }).properties;
      if (!properties) return [];
      const name = plainText((properties.Nome as { title?: unknown })?.title);
      const description = plainText((properties["Descrição"] as { rich_text?: unknown })?.rich_text);
      const href = plainText((properties.Link as { rich_text?: unknown })?.rich_text);
      if (!name || !href || !validHref(href)) return [];
      return [{
        id: (page as { id: string }).id,
        name,
        description,
        href,
        category: readSelect(properties.Categoria) || "CPPEM",
        icon: readSelect(properties["Ícone"]) || "Estrela",
        label: plainText((properties.Etiqueta as { rich_text?: unknown })?.rich_text),
        featured: readCheckbox(properties.Destaque),
        order: readNumber(properties.Ordem) ?? Number.MAX_SAFE_INTEGER,
        newTab: readCheckbox(properties["Nova aba"]),
      }];
    });
    return items.length ? items : fallbackItems;
  } catch (error) {
    console.error("[ecosystem] Falha ao carregar o Ecossistema CPPEM:", error instanceof Error ? error.message : "erro desconhecido");
    return fallbackItems;
  }
}

export const getEcosystemItems = unstable_cache(fetchEcosystemItems, ["ecosystem-items"], { revalidate: 300, tags: ["ecosystem"] });
