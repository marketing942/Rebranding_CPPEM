import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [, , sourceArg, outputArg] = process.argv;

if (!sourceArg || !outputArg) {
  throw new Error("Uso: node scripts/build-n8n-news-workflow.mjs <workflow-origem.json> <workflow-saida.json>");
}

const source = JSON.parse(await readFile(resolve(sourceArg), "utf8"));
const workflow = structuredClone(source);

workflow.name = "NOTICIAS BLOG - SITE NOVO (TESTE)";
workflow.active = false;

const extractNode = workflow.nodes.find((node) => node.id === "777fa7d3-00b2-43d0-9a5b-7e5a05470915");
const structureNode = workflow.nodes.find((node) => node.id === "82a67a69-fc61-4d12-8167-8b9a61df4574");
const createRowNode = workflow.nodes.find((node) => node.type === "n8n-nodes-base.supabase");
const addSheetNode = workflow.nodes.find((node) => node.type === "n8n-nodes-base.googleSheets" && node.parameters.operation === "append");
const loopNode = workflow.nodes.find((node) => node.type === "n8n-nodes-base.splitInBatches");

if (!extractNode || !structureNode || !createRowNode || !addSheetNode || !loopNode) {
  throw new Error("O workflow de origem não possui todos os nós esperados.");
}

const extractionValues = extractNode.parameters.extractionValues.values;
if (!extractionValues.some((value) => value.key === "image")) {
  extractionValues.push({
    key: "image",
    cssSelector: "meta[property=\"og:image\"]",
    returnValue: "attribute",
    attribute: "content",
  });
}

structureNode.parameters.jsCode = `let raw = String($json.output ?? "");
const match = raw.match(/\`\`\`json\\s*([\\s\\S]*?)\\s*\`\`\`/);
if (match) raw = match[1];

const obj = JSON.parse(raw);
const extracted = $("${extractNode.name}").item.json;
const source = $("${loopNode.name}").item.json;

return {
  json: {
    title: obj.title,
    slug: obj.slug,
    content: obj.content,
    image: extracted.image || "/images/bgnews.webp",
    sourceUrl: source["LINKS NOVOS"],
  },
};`;

const fields = createRowNode.parameters.fieldsUi.fieldValues.filter((field) => field.fieldId);
const fieldMap = new Map(fields.map((field) => [field.fieldId, field]));
fieldMap.get("imagem").fieldValue = "={{ $json.image }}";
fieldMap.get("link").fieldValue = "={{ $json.sourceUrl }}";
fieldMap.get("is_external").fieldValue = "false";
createRowNode.parameters.fieldsUi.fieldValues = fields;

const removedNodeNames = new Set(
  workflow.nodes
    .filter((node) => node.type === "n8n-nodes-evolution-api.evolutionApi"
      || node.type === "n8n-nodes-uploadtourl.uploadToUrl"
      || node.name === "Replace Me1")
    .map((node) => node.name),
);

workflow.nodes = workflow.nodes.filter((node) => !removedNodeNames.has(node.name));
for (const removedName of removedNodeNames) delete workflow.connections[removedName];

for (const connection of Object.values(workflow.connections)) {
  if (!connection.main) continue;
  connection.main = connection.main.map((branch) => branch.filter((edge) => !removedNodeNames.has(edge.node)));
}

workflow.connections[createRowNode.name] = {
  main: [[{ node: addSheetNode.name, type: "main", index: 0 }]],
};
workflow.connections[addSheetNode.name] = {
  main: [[{ node: loopNode.name, type: "main", index: 0 }]],
};

delete workflow.pinData;
delete workflow.id;
delete workflow.versionId;
delete workflow.meta;
delete workflow.nodeGroups;

const outputPath = resolve(outputArg);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(workflow, null, 2)}\n`, "utf8");
console.log(outputPath);
