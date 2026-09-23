import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de rodar o seed.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const dir = path.join(process.cwd(), "data", "questions");
const files = (await readdir(dir)).filter((name) => name.endsWith(".json")).sort();

for (const file of files) {
  const questions = JSON.parse(await readFile(path.join(dir, file), "utf8"));
  for (let i = 0; i < questions.length; i += 200) {
    const batch = questions.slice(i, i + 200);
    const { error } = await supabase.from("exam_questions").upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`${file}: falha no lote iniciado em ${i} — ${error.message}`);
      process.exit(1);
    }
  }
  console.log(`${file}: ${questions.length} questões gravadas.`);
}
