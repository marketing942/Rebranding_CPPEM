import nextEnv from "@next/env";
import { Client } from "@notionhq/client";

nextEnv.loadEnvConfig(process.cwd());
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const database = await notion.databases.retrieve({ database_id: process.env.NOTION_MATERIAIS_DATABASE_ID });
const dataSourceId = database.data_sources?.[0]?.id;
const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
const missing = {};
if (!dataSource.properties?.["Destaque no menu"]) missing["Destaque no menu"] = { checkbox: {} };
if (!dataSource.properties?.["Ordem no menu"]) missing["Ordem no menu"] = { number: { format: "number" } };

if (Object.keys(missing).length) {
  await notion.dataSources.update({ data_source_id: dataSourceId, properties: missing });
  console.log(`Campos criados: ${Object.keys(missing).join(", ")}`);
} else {
  console.log("Campos de destaque já existem.");
}
