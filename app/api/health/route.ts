// Resposta leve para o healthcheck do container: nao toca em Notion nem Supabase.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" });
}
