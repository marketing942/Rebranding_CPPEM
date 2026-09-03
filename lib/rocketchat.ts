import "server-only";

export async function notifyRocketChat(text: string, imageUrl?: string | null) {
  const url = process.env.ROCKETCHAT_WEBHOOK_URL;
  if (!url) return false;
  const body: Record<string, unknown> = { text };
  if (imageUrl) body.attachments = [{ title: "Logo enviada", title_link: imageUrl, image_url: imageUrl }];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error("[rocketchat] Falha ao notificar proposta:", error instanceof Error ? error.message : "erro desconhecido");
    return false;
  }
}
