import nextEnv from "@next/env";
import { Client } from "@notionhq/client";

nextEnv.loadEnvConfig(process.cwd());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const parentPageId = "3abbbae8-074c-802a-a85e-dfc8e1b37adc";
const databaseTitle = "Ecossistema CPPEM";

const seeds = [
  { name: "Mentoria individual", description: "Estratégia individual para rotina, método e concurso.", href: "https://individual.cppem.com.br", category: "Mentoria", icon: "Alvo", featured: true, order: 1 },
  { name: "Faculdade EAD", description: "Formação superior a distância para avançar na carreira.", href: "https://contato.unicive.cppem.com.br", category: "Formação", icon: "Graduação", featured: true, order: 2 },
  { name: "Supletivo", description: "Conclusão da escolaridade para liberar o próximo passo.", href: "https://supletivo.cppem.com.br", category: "Formação", icon: "Diploma", featured: true, order: 3 },
  { name: "Presencial em Caruaru", description: "Aulas, acompanhamento e rotina dentro da sala.", href: "/presencial", category: "Preparação", icon: "Local", featured: false, order: 4 },
  { name: "Plano de Combate", description: "Método, cronograma e acompanhamento na preparação online.", href: "/plano-de-combate", category: "Preparação", icon: "Escudo", featured: false, order: 5 },
  { name: "Loja CPPEM", description: "Materiais e ferramentas para fortalecer sua preparação.", href: "https://cppem.lojaintegrada.com.br", category: "Materiais", icon: "Loja", featured: false, order: 6 },
];

async function findExistingDatabase() {
  if (process.env.NOTION_ECOSYSTEM_DATABASE_ID) {
    return notion.databases.retrieve({ database_id: process.env.NOTION_ECOSYSTEM_DATABASE_ID });
  }
  const search = await notion.search({ query: databaseTitle, filter: { property: "object", value: "data_source" }, page_size: 50 });
  for (const item of search.results) {
    if (item.object !== "data_source") continue;
    const dataSource = await notion.dataSources.retrieve({ data_source_id: item.id });
    const title = (dataSource.title ?? []).map((part) => part.plain_text).join("");
    if (title !== databaseTitle || dataSource.parent?.type !== "database_id") continue;
    const database = await notion.databases.retrieve({ database_id: dataSource.parent.database_id });
    if (title === databaseTitle && database.parent?.type === "page_id" && database.parent.page_id === parentPageId) return database;
  }
  return null;
}

let database = await findExistingDatabase();
if (!database) {
  database = await notion.databases.create({
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ type: "text", text: { content: databaseTitle } }],
    description: [{ type: "text", text: { content: "Itens exibidos no mega menu Ecossistema CPPEM do novo site." } }],
    is_inline: true,
    initial_data_source: {
      properties: {
        Nome: { title: {} },
        Descrição: { rich_text: {} },
        Link: { rich_text: {} },
        Categoria: { select: { options: [
          { name: "Preparação", color: "yellow" },
          { name: "Mentoria", color: "orange" },
          { name: "Formação", color: "blue" },
          { name: "Materiais", color: "gray" },
        ] } },
        Ícone: { select: { options: [
          { name: "Alvo", color: "red" }, { name: "Graduação", color: "blue" },
          { name: "Diploma", color: "purple" }, { name: "Local", color: "orange" },
          { name: "Escudo", color: "yellow" }, { name: "Loja", color: "gray" },
        ] } },
        Etiqueta: { rich_text: {} },
        Destaque: { checkbox: {} },
        Ativo: { checkbox: {} },
        Ordem: { number: { format: "number" } },
        "Nova aba": { checkbox: {} },
      },
    },
  });
  console.log(`Banco criado: ${database.id}`);
} else {
  console.log(`Banco existente: ${database.id}`);
}

const dataSourceId = database.data_sources?.[0]?.id;
if (!dataSourceId) throw new Error("O banco não possui uma fonte de dados.");

const existing = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 100 });
const existingNames = new Set(existing.results.map((page) => {
  if (page.object !== "page" || !("properties" in page)) return "";
  const title = page.properties.Nome;
  return title?.type === "title" ? title.title.map((part) => part.plain_text).join("") : "";
}));

for (const item of seeds) {
  if (existingNames.has(item.name)) continue;
  await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: dataSourceId },
    properties: {
      Nome: { title: [{ type: "text", text: { content: item.name } }] },
      Descrição: { rich_text: [{ type: "text", text: { content: item.description } }] },
      Link: { rich_text: [{ type: "text", text: { content: item.href } }] },
      Categoria: { select: { name: item.category } },
      Ícone: { select: { name: item.icon } },
      Destaque: { checkbox: item.featured },
      Ativo: { checkbox: true },
      Ordem: { number: item.order },
      "Nova aba": { checkbox: item.href.startsWith("https://") },
    },
  });
  console.log(`Item criado: ${item.name}`);
}

console.log(`NOTION_ECOSYSTEM_DATABASE_ID=${database.id}`);
