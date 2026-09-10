import nextEnv from "@next/env";
import { Client } from "@notionhq/client";

nextEnv.loadEnvConfig(process.cwd());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const parentPageId = "3abbbae8-074c-802a-a85e-dfc8e1b37adc";
const databaseTitle = "Concursos CPPEM";

async function findExistingDatabase() {
  if (process.env.NOTION_CONTESTS_DATABASE_ID) {
    return notion.databases.retrieve({ database_id: process.env.NOTION_CONTESTS_DATABASE_ID });
  }

  const search = await notion.search({ query: databaseTitle, filter: { property: "object", value: "data_source" }, page_size: 50 });
  for (const item of search.results) {
    if (item.object !== "data_source") continue;
    const dataSource = await notion.dataSources.retrieve({ data_source_id: item.id });
    const title = (dataSource.title ?? []).map((part) => part.plain_text).join("");
    if (title !== databaseTitle || dataSource.parent?.type !== "database_id") continue;
    const database = await notion.databases.retrieve({ database_id: dataSource.parent.database_id });
    if (database.parent?.type === "page_id" && database.parent.page_id === parentPageId) return database;
  }
  return null;
}

let database = await findExistingDatabase();
if (!database) {
  database = await notion.databases.create({
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: databaseTitle } }],
    description: [{ type: "text", text: { content: "Fonte editorial dos concursos exibidos no mapa, biblioteca e páginas de detalhes do novo site CPPEM." } }],
    is_inline: false,
    initial_data_source: {
      properties: {
        Nome: { title: {} },
        Sigla: { rich_text: {} },
        Slug: { rich_text: {} },
        Órgão: { rich_text: {} },
        Carreira: { select: { options: [
          { name: "Polícia Rodoviária Federal", color: "yellow" },
          { name: "Polícia Federal", color: "blue" },
          { name: "DEPEN", color: "gray" },
          { name: "Polícia Civil", color: "purple" },
          { name: "Polícia Penal", color: "orange" },
          { name: "Polícia Militar", color: "red" },
          { name: "Guarda Municipal", color: "green" },
        ] } },
        Status: { select: { options: [
          { name: "Publicado", color: "green" },
          { name: "Em andamento", color: "blue" },
          { name: "Autorizado", color: "yellow" },
          { name: "Banca definida", color: "purple" },
          { name: "Comissão formada", color: "orange" },
          { name: "Previsto", color: "gray" },
          { name: "Solicitado", color: "brown" },
          { name: "Encerrado", color: "red" },
        ] } },
        Estados: { multi_select: { options: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"].map((name) => ({ name, color: "yellow" })) } },
        Abrangência: { select: { options: [
          { name: "Estadual", color: "yellow" },
          { name: "Federal", color: "blue" },
          { name: "Nacional", color: "purple" },
        ] } },
        Vagas: { rich_text: {} },
        Salário: { rich_text: {} },
        Banca: { rich_text: {} },
        Cargos: { multi_select: {} },
        Resumo: { rich_text: {} },
        "Conteúdo editorial": { rich_text: {} },
        Requisitos: { rich_text: {} },
        Etapas: { rich_text: {} },
        "Nome da fonte": { rich_text: {} },
        "Fonte oficial": { url: {} },
        "Última verificação": { date: {} },
        "Data de publicação": { date: {} },
        "Sigla da preparação": { rich_text: {} },
        Publicado: { checkbox: {} },
      },
    },
  });
  console.log(`Banco criado: ${database.id}`);
} else {
  console.log(`Banco existente: ${database.id}`);
}

if (database.is_inline) {
  database = await notion.databases.update({ database_id: database.id, is_inline: false });
  console.log("Banco convertido para página completa.");
}

const dataSourceId = database.data_sources?.[0]?.id;
if (!dataSourceId) throw new Error("O banco não possui uma fonte de dados.");

const coursesDatabaseId = process.env.NOTION_COURSES_DATABASE_ID;
if (!coursesDatabaseId) throw new Error("NOTION_COURSES_DATABASE_ID não configurado.");
const coursesDatabase = await notion.databases.retrieve({ database_id: coursesDatabaseId });
const coursesDataSourceId = coursesDatabase.data_sources?.[0]?.id;
if (!coursesDataSourceId) throw new Error("O banco Cursos CPPEM não possui uma fonte de dados.");

let contestsDataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
if (!contestsDataSource.properties?.["Preparações CPPEM"]) {
  await notion.dataSources.update({
    data_source_id: dataSourceId,
    properties: {
      "Preparações CPPEM": {
        relation: {
          data_source_id: coursesDataSourceId,
          type: "single_property",
          single_property: {},
        },
      },
    },
  });
  contestsDataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
  console.log("Relação criada: Preparações CPPEM → Cursos CPPEM");
}

const existing = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 100 });
if (!existing.results.length) {
  const draftSeeds = [
    { name: "Polícia Militar de Pernambuco", acronym: "PMPE", career: "Polícia Militar", openings: "1.320 vagas", salary: "Até R$ 5.617,92", education: "Ensino médio" },
    { name: "Polícia Civil de Pernambuco", acronym: "PCPE", career: "Polícia Civil", openings: "1.315 vagas", salary: "A definir", education: "Nível superior conforme o cargo" },
  ];

  for (const item of draftSeeds) {
    await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties: {
        Nome: { title: [{ type: "text", text: { content: item.name } }] },
        Sigla: { rich_text: [{ type: "text", text: { content: item.acronym } }] },
        Slug: { rich_text: [{ type: "text", text: { content: `${item.acronym.toLowerCase()}-${item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` } }] },
        Órgão: { rich_text: [{ type: "text", text: { content: item.name } }] },
        Carreira: { select: { name: item.career } },
        Status: { select: { name: "Previsto" } },
        Estados: { multi_select: [{ name: "PE" }] },
        Abrangência: { select: { name: "Estadual" } },
        Vagas: { rich_text: [{ type: "text", text: { content: item.openings } }] },
        Salário: { rich_text: [{ type: "text", text: { content: item.salary } }] },
        Requisitos: { rich_text: [{ type: "text", text: { content: item.education } }] },
        "Sigla da preparação": { rich_text: [{ type: "text", text: { content: item.acronym } }] },
        Publicado: { checkbox: false },
      },
    });
    console.log(`Rascunho criado: ${item.acronym}`);
  }
}

const courses = await notion.dataSources.query({ data_source_id: coursesDataSourceId, page_size: 100 });
const courseIdByAcronym = new Map();
for (const page of courses.results) {
  if (page.object !== "page" || !("properties" in page)) continue;
  const acronymProperty = page.properties.Sigla;
  const acronym = acronymProperty?.type === "rich_text" ? acronymProperty.rich_text.map((part) => part.plain_text).join("").trim().toUpperCase() : "";
  if (acronym) courseIdByAcronym.set(acronym, page.id);
}

const currentContests = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 100 });
const publicationDefaults = {
  PMPE: {
    summary: "Acompanhe as principais informações do concurso da Polícia Militar de Pernambuco e encontre a preparação relacionada do CPPEM.",
    content: "O CPPEM acompanha as movimentações da Polícia Militar de Pernambuco para manter o candidato orientado sobre vagas, banca e próximas etapas do certame.",
    positions: ["Soldado", "Oficial"],
  },
  PCPE: {
    summary: "Acompanhe as principais informações do concurso da Polícia Civil de Pernambuco e encontre a preparação relacionada do CPPEM.",
    content: "O CPPEM acompanha as movimentações da Polícia Civil de Pernambuco para manter o candidato orientado sobre cargos, banca e próximas etapas do certame.",
    positions: ["Agente", "Escrivão", "Delegado"],
  },
};

for (const page of currentContests.results) {
  if (page.object !== "page" || !("properties" in page)) continue;
  const acronymProperty = page.properties.Sigla;
  const acronym = acronymProperty?.type === "rich_text" ? acronymProperty.rich_text.map((part) => part.plain_text).join("").trim().toUpperCase() : "";
  const defaults = publicationDefaults[acronym];
  const courseId = courseIdByAcronym.get(acronym);
  if (!defaults || !courseId) continue;

  await notion.pages.update({
    page_id: page.id,
    properties: {
      Resumo: { rich_text: [{ type: "text", text: { content: defaults.summary } }] },
      "Conteúdo editorial": { rich_text: [{ type: "text", text: { content: defaults.content } }] },
      Cargos: { multi_select: defaults.positions.map((name) => ({ name })) },
      Banca: { rich_text: [{ type: "text", text: { content: "A definir" } }] },
      "Nome da fonte": { rich_text: [{ type: "text", text: { content: "Governo de Pernambuco" } }] },
      "Fonte oficial": { url: "https://www.pe.gov.br/" },
      "Última verificação": { date: { start: "2026-09-04" } },
      "Data de publicação": { date: { start: "2026-09-04" } },
      "Preparações CPPEM": { relation: [{ id: courseId }] },
      Publicado: { checkbox: true },
    },
  });
  console.log(`Concurso publicado e vinculado: ${acronym}`);
}

console.log(`Database: ${database.url}`);
console.log(`NOTION_CONTESTS_DATABASE_ID=${database.id}`);
