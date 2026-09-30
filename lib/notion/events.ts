import "server-only";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion/client";
import { semDuplicar } from "@/lib/notion/inflight";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import type { EventItem } from "@/types/events";

type Properties = Record<string, unknown>;

// Banco "Eventos CPPEM", na mesma pagina dos outros bancos do site. O ID nao e
// segredo: fica como padrao para o menu funcionar sem configurar variavel nova
// no Portainer/Vercel. A variavel continua valendo se um dia o banco mudar.
const EVENTS_DATABASE_ID = process.env.NOTION_EVENTS_DATABASE_ID || "06eb7e72-ab26-4c35-9f5c-00f0e051cca9";

// ordem de exibicao: o que da para participar agora vem primeiro
const statusOrder: Record<string, number> = { "Ao vivo": 0, "Inscrições abertas": 1, "Em breve": 2, "Lista de espera": 3, Encerrado: 4 };

function validHref(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isSafeWebUrl(value);
}

function readDate(value: unknown): string | null {
  const start = (value as { date?: { start?: string } | null } | undefined)?.date?.start;
  return typeof start === "string" ? start.slice(0, 10) : null;
}

async function fetchEvents(): Promise<EventItem[]> {
  if (!notion) return [];
  try {
    const dataSourceId = await resolveDataSourceId(EVENTS_DATABASE_ID);
    if (!dataSourceId) return [];
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Ativo", checkbox: { equals: true } },
      sorts: [{ property: "Ordem", direction: "ascending" }],
      page_size: 100,
    });

    const events = response.results.flatMap((page) => {
      const properties = (page as { properties?: Properties }).properties;
      if (!properties) return [];
      const name = plainText((properties.Nome as { title?: unknown })?.title);
      const href = readUrl(properties.Link);
      if (!name || !href || !validHref(href)) return [];
      const imageUrl = readUrl(properties.Imagem);
      return [{
        id: (page as { id: string }).id,
        name,
        description: plainText((properties["Descrição"] as { rich_text?: unknown })?.rich_text),
        href,
        status: readSelect(properties.Status) || "Em breve",
        date: readDate(properties.Data),
        time: plainText((properties["Horário"] as { rich_text?: unknown })?.rich_text),
        place: plainText((properties.Local as { rich_text?: unknown })?.rich_text),
        format: readSelect(properties.Formato),
        price: plainText((properties["Preço"] as { rich_text?: unknown })?.rich_text),
        imageUrl: isSafeWebUrl(imageUrl) ? imageUrl : null,
        label: plainText((properties.Etiqueta as { rich_text?: unknown })?.rich_text),
        featured: readCheckbox(properties.Destaque),
        order: readNumber(properties.Ordem) ?? Number.MAX_SAFE_INTEGER,
      }];
    });

    return events.sort((a, b) =>
      Number(b.featured) - Number(a.featured)
      || (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
      || a.order - b.order);
  } catch (error) {
    console.error("[eventos] Falha ao carregar Eventos CPPEM:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

export const getEvents = unstable_cache(() => semDuplicar("notion-events", fetchEvents), ["notion-events"], { revalidate: 300, tags: ["eventos"] });
