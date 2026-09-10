import nextEnv from "@next/env";
import { Client } from "@notionhq/client";

nextEnv.loadEnvConfig(process.cwd());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_COURSES_DATABASE_ID;
if (!databaseId) throw new Error("NOTION_COURSES_DATABASE_ID não configurado.");

const database = await notion.databases.retrieve({ database_id: databaseId });
const dataSourceId = database.data_sources?.[0]?.id;
if (!dataSourceId) throw new Error("A database Cursos CPPEM não possui fonte de dados.");

const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
const missing = {};

if (!dataSource.properties?.["O que você irá estudar"]) missing["O que você irá estudar"] = { multi_select: {} };
if (!dataSource.properties?.["Para quem é"]) missing["Para quem é"] = { rich_text: {} };
if (!dataSource.properties?.["Diferenciais do curso"]) missing["Diferenciais do curso"] = { rich_text: {} };
if (!dataSource.properties?.["Carga horária"]) missing["Carga horária"] = { rich_text: {} };
if (!dataSource.properties?.["Tempo de acesso"]) missing["Tempo de acesso"] = { rich_text: {} };

if (Object.keys(missing).length) {
  await notion.dataSources.update({ data_source_id: dataSourceId, properties: missing });
  console.log(`Campos criados: ${Object.keys(missing).join(", ")}`);
} else {
  console.log("Os campos de conteúdo do curso já existem.");
}

console.log(`Database: ${database.url}`);
