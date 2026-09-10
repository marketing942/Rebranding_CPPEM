import "server-only";
import { notion } from "@/lib/notion/client";
import { plainText, readCheckbox, readRelationIds, readSelect, readUrl, resolveDataSourceId } from "@/lib/notion/properties";
import { contestStatuses, type Contest, type ContestStatus, type CourseProduct } from "@/types/content";

const statusByLabel: Record<string, ContestStatus> = {
  Publicado: "publicado",
  "Em andamento": "em-andamento",
  Autorizado: "autorizado",
  "Banca definida": "banca-definida",
  "Comissão formada": "comissao-formada",
  Previsto: "previsto",
  Solicitado: "solicitado",
  Encerrado: "encerrado",
};

const scopeByLabel: Record<string, Contest["scope"]> = {
  Estadual: "estadual",
  Federal: "federal",
  Nacional: "nacional",
};

function readMultiSelect(value: unknown): string[] {
  const options = (value as { multi_select?: Array<{ name?: string }> } | undefined)?.multi_select;
  return Array.isArray(options) ? options.map((option) => option.name?.trim()).filter((name): name is string => Boolean(name)) : [];
}

function readDate(value: unknown): string {
  const start = (value as { date?: { start?: string } | null } | undefined)?.date?.start;
  return typeof start === "string" ? start.slice(0, 10) : "";
}

function lines(value: string): string[] {
  return value.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean);
}

export async function getNotionContests(courses: CourseProduct[]): Promise<Contest[] | null> {
  const databaseId = process.env.NOTION_CONTESTS_DATABASE_ID;
  if (!notion || !databaseId) return null;

  try {
    const dataSourceId = await resolveDataSourceId(databaseId, notion);
    if (!dataSourceId) return [];
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Publicado", checkbox: { equals: true } },
      page_size: 100,
    });

    const contests: Contest[] = [];
    for (const page of response.results) {
      const properties = (page as { properties?: Record<string, unknown> }).properties;
      if (!properties || !readCheckbox(properties.Publicado)) continue;

      const title = plainText((properties.Nome as { title?: unknown })?.title);
      const acronym = plainText((properties.Sigla as { rich_text?: unknown })?.rich_text);
      const slug = plainText((properties.Slug as { rich_text?: unknown })?.rich_text);
      const lastVerifiedAt = readDate(properties["Última verificação"]);
      const status = statusByLabel[readSelect(properties.Status)];
      if (!title || !acronym || !slug || !lastVerifiedAt || !status || !contestStatuses.includes(status)) continue;

      const relatedCourseIds = new Set(readRelationIds(properties["Preparações CPPEM"]));
      const preparationAcronym = plainText((properties["Sigla da preparação"] as { rich_text?: unknown })?.rich_text) || acronym;
      const relatedCourses = courses.filter((course) => relatedCourseIds.has(course.id));
      if (!relatedCourses.length) {
        const matchedCourse = courses.find((course) => course.acronym?.trim().toUpperCase() === preparationAcronym.trim().toUpperCase());
        if (matchedCourse) relatedCourses.push(matchedCourse);
      }
      const sourceUrl = readUrl(properties["Fonte oficial"]);

      contests.push({
        id: (page as { id: string }).id,
        slug,
        title,
        acronym,
        organization: plainText((properties["Órgão"] as { rich_text?: unknown })?.rich_text) || title,
        career: readSelect(properties.Carreira),
        status,
        states: readMultiSelect(properties.Estados).map((state) => state.toUpperCase()),
        scope: scopeByLabel[readSelect(properties.Abrangência)] ?? "estadual",
        openings: plainText((properties.Vagas as { rich_text?: unknown })?.rich_text) || "A definir",
        salary: plainText((properties.Salário as { rich_text?: unknown })?.rich_text) || "A definir",
        examBoard: plainText((properties.Banca as { rich_text?: unknown })?.rich_text) || "A definir",
        positions: readMultiSelect(properties.Cargos),
        summary: plainText((properties.Resumo as { rich_text?: unknown })?.rich_text),
        contentMd: plainText((properties["Conteúdo editorial"] as { rich_text?: unknown })?.rich_text),
        requirements: lines(plainText((properties.Requisitos as { rich_text?: unknown })?.rich_text)),
        stages: lines(plainText((properties.Etapas as { rich_text?: unknown })?.rich_text)),
        sourceLabel: plainText((properties["Nome da fonte"] as { rich_text?: unknown })?.rich_text) || "Fonte oficial",
        sourceUrl,
        lastVerifiedAt,
        publishedAt: readDate(properties["Data de publicação"]) || lastVerifiedAt,
        product: relatedCourses[0] ?? null,
        products: relatedCourses,
      });
    }

    return contests;
  } catch (error) {
    console.error("[notion] Falha ao carregar concursos:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}
