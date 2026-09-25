import "server-only";
import { unstable_cache } from "next/cache";
import { notion } from "@/lib/notion/client";
import { semDuplicar } from "@/lib/notion/inflight";
import { getNotionProducts } from "@/lib/notion/homepage";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readRelationIds, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import type { CourseAnswer, CourseProduct } from "@/types/content";

function answer(value: string): CourseAnswer {
  return value === "Sim" || value === "Não" ? value : "A confirmar";
}

function multiSelect(value: unknown): string[] {
  const options = (value as { multi_select?: Array<{ name?: string }> } | undefined)?.multi_select;
  return Array.isArray(options) ? options.map((option) => option.name?.trim()).filter((name): name is string => Boolean(name)) : [];
}

function lines(value: string): string[] {
  return value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
}

async function lerCursos(): Promise<CourseProduct[] | null> {
  const databaseId = process.env.NOTION_COURSES_DATABASE_ID;
  if (!notion || !databaseId) return null;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, notion);
    if (!dataSourceId) return [];
    // o catálogo passou de 200 itens: sem paginar, o Notion devolve só os 100 primeiros
    const pages = [];
    let cursor: string | undefined;
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: { property: "Status", select: { equals: "Ativo" } },
        page_size: 100,
        start_cursor: cursor,
      });
      pages.push(...response.results);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    const relatedProducts = (await getNotionProducts()) ?? [];
    const courses: CourseProduct[] = [];
    for (const page of pages) {
      const properties = (page as { properties?: Record<string, unknown> }).properties;
      if (!properties) continue;
      const name = plainText((properties.Nome as { title?: unknown })?.title);
      const storeHref = readUrl(properties.Link);
      // item digital vai direto ao checkout; fisico precisa do frete da loja
      const delivery = readSelect(properties.Entrega) || "Digital";
      const checkoutUrl = delivery === "Digital" ? readUrl(properties.Checkout) : "";
      const href = checkoutUrl && isSafeWebUrl(checkoutUrl) ? checkoutUrl : storeHref;
      const imageUrl = readUrl(properties.Imagem);
      const relatedIds = new Set(readRelationIds(properties["Preparações extras"]));
      if (readSelect(properties.Status) !== "Ativo" || !name || !storeHref || !isSafeWebUrl(imageUrl)) continue;

      courses.push({
        id: (page as { id: string }).id,
        slug: (page as { id: string }).id.replaceAll("-", ""),
        name,
        category: readSelect(properties.Tipo) || readSelect(properties.Modalidade) || "Curso CPPEM",
        modality: readSelect(properties.Modalidade),
        type: readSelect(properties.Tipo) || "Curso online",
        delivery,
        checkoutUrl: href === checkoutUrl ? checkoutUrl : null,
        description: plainText((properties["Descrição Curta"] as { rich_text?: unknown })?.rich_text),
        price: plainText((properties.Preço as { rich_text?: unknown })?.rich_text),
        oldPrice: plainText((properties["Preço antigo"] as { rich_text?: unknown })?.rich_text) || null,
        imageUrl,
        href,
        career: readSelect(properties.Carreira),
        acronym: plainText((properties.Sigla as { rich_text?: unknown })?.rich_text),
        menuFeatured: readCheckbox(properties["Destaque no menu"]),
        menuImageUrl: readUrl(properties["Imagem do menu"]) || null,
        menuOrder: readNumber(properties["Ordem no menu"]),
        contestStatus: readSelect(properties["Status do concurso"]) || "A confirmar",
        openings: plainText((properties["Nº de vagas"] as { rich_text?: unknown })?.rich_text) || "A definir",
        salary: plainText((properties.Salário as { rich_text?: unknown })?.rich_text) || "A definir",
        registrationDate: plainText((properties["Data de inscrição"] as { rich_text?: unknown })?.rich_text) || "A definir",
        registrationFee: plainText((properties["Taxa de inscrição"] as { rich_text?: unknown })?.rich_text) || "A definir",
        education: plainText((properties.Escolaridade as { rich_text?: unknown })?.rich_text) || "A definir",
        examDate: plainText((properties["Data da prova"] as { rich_text?: unknown })?.rich_text) || "A definir",
        taf: answer(readSelect(properties.TAF)),
        discursiveEssay: answer(readSelect(properties["Redação discursiva"])),
        examBoard: plainText((properties.Banca as { rich_text?: unknown })?.rich_text) || "A definir",
        titleExam: answer(readSelect(properties["Prova de títulos"])),
        contestDescription: plainText((properties["Descrição do concurso"] as { rich_text?: unknown })?.rich_text),
        studyTopics: multiSelect(properties["O que você irá estudar"]),
        courseAudience: plainText((properties["Para quem é"] as { rich_text?: unknown })?.rich_text),
        courseHighlights: lines(plainText((properties["Diferenciais do curso"] as { rich_text?: unknown })?.rich_text)),
        workload: plainText((properties["Carga horária"] as { rich_text?: unknown })?.rich_text),
        accessDuration: plainText((properties["Tempo de acesso"] as { rich_text?: unknown })?.rich_text),
        relatedProducts: relatedProducts.filter((product) => relatedIds.has(product.id)),
      });
    }

    return courses;
  } catch (error) {
    console.error("[notion] Falha ao carregar cursos:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

// o catalogo inteiro sao 4 requisicoes ao Notion; sem cache cada pagina de
// curso ou concurso refazia todas e a integracao batia no limite de 3 req/s
export const getNotionCourses = unstable_cache(
  () => semDuplicar("notion-courses", lerCursos),
  ["notion-courses"],
  { revalidate: 300, tags: ["cursos"] },
);
