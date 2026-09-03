import "server-only";
import { notion } from "@/lib/notion/client";
import { getNotionProducts } from "@/lib/notion/homepage";
import { isSafeWebUrl, plainText, readCheckbox, readNumber, readRelationIds, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import type { CourseAnswer, CourseProduct } from "@/types/content";

function answer(value: string): CourseAnswer {
  return value === "Sim" || value === "Não" ? value : "A confirmar";
}

export async function getNotionCourses(): Promise<CourseProduct[] | null> {
  const databaseId = process.env.NOTION_COURSES_DATABASE_ID;
  if (!notion || !databaseId) return null;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, notion);
    if (!dataSourceId) return [];
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Status", select: { equals: "Ativo" } },
    });

    const relatedProducts = (await getNotionProducts()) ?? [];
    const courses: CourseProduct[] = [];
    for (const page of response.results) {
      const properties = (page as { properties?: Record<string, unknown> }).properties;
      if (!properties) continue;
      const name = plainText((properties.Nome as { title?: unknown })?.title);
      const href = readUrl(properties.Link);
      const imageUrl = readUrl(properties.Imagem);
      const relatedIds = new Set(readRelationIds(properties["Preparações extras"]));
      if (readSelect(properties.Status) !== "Ativo" || !name || !href || !isSafeWebUrl(imageUrl)) continue;

      courses.push({
        id: (page as { id: string }).id,
        slug: (page as { id: string }).id.replaceAll("-", ""),
        name,
        category: readSelect(properties.Modalidade) || "Curso CPPEM",
        modality: readSelect(properties.Modalidade),
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
        relatedProducts: relatedProducts.filter((product) => relatedIds.has(product.id)),
      });
    }

    return courses;
  } catch (error) {
    console.error("[notion] Falha ao carregar cursos:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}
