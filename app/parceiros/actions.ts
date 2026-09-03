"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createPartnerProposalInNotion } from "@/lib/notion/partners";
import { partnerCategories } from "@/lib/partners";
import { notifyRocketChat } from "@/lib/rocketchat";
import { getSupabasePublicEnv } from "@/lib/supabase/public";

const proposalSchema = z.object({
  company: z.string().trim().min(2, "Informe o nome da empresa").max(120, "Use até 120 caracteres"),
  segment: z.string().trim().min(1, "Selecione o segmento").max(40),
  contact: z.string().trim().min(2, "Informe o responsável").max(100),
  whatsapp: z.string().trim().refine((value) => /\d/.test(value), "Informe o WhatsApp").refine((value) => value.replace(/\D/g, "").length <= 15, "Confira o número informado"),
  benefit: z.string().trim().max(1200, "Use até 1.200 caracteres").optional(),
});

export type PartnerProposalState = { success?: boolean; error?: string; fieldErrors?: Record<string, string[]> };

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const LOGO_BUCKET = "parceiros-logos";

function sniffImage(bytes: Uint8Array) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { ext: "png", mime: "image/png" };
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return { ext: "webp", mime: "image/webp" };
  return null;
}

function createServiceClient() {
  const env = getSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !key) return null;
  return createClient(env.url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function uploadLogo(formData: FormData, supabase: SupabaseClient) {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { url: null as string | null };
  if (file.size > MAX_LOGO_BYTES) return { url: null, error: "A logo deve ter no máximo 2 MB." };
  const type = sniffImage(new Uint8Array(await file.arrayBuffer()));
  if (!type) return { url: null, error: "Envie uma imagem PNG, JPG ou WebP válida." };
  const path = `propostas/${crypto.randomUUID()}.${type.ext}`;
  const { error } = await supabase.storage.from(LOGO_BUCKET).upload(path, file, { contentType: type.mime, upsert: false });
  if (error) {
    console.error("[partners] Falha no upload da logo:", error.message);
    return { url: null as string | null };
  }
  return { url: supabase.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl };
}

export async function submitPartnerProposal(_previous: PartnerProposalState | null, formData: FormData): Promise<PartnerProposalState> {
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) return { success: true };

  const parsed = proposalSchema.safeParse({
    company: formData.get("empresa") ?? "",
    segment: formData.get("segmento") ?? "",
    contact: formData.get("nome_responsavel") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    benefit: formData.get("beneficio") ?? "",
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };

  const supabase = createServiceClient();
  if (!supabase) return { error: "Serviço temporariamente indisponível. Tente novamente." };
  const logo = await uploadLogo(formData, supabase);
  if (logo.error) return { fieldErrors: { logo: [logo.error] } };

  const { error } = await supabase.from("parceiro_propostas").insert({
    empresa: parsed.data.company,
    segmento: parsed.data.segment,
    responsavel: parsed.data.contact,
    whatsapp: parsed.data.whatsapp,
    beneficio: parsed.data.benefit || null,
    logo_url: logo.url,
  });
  if (error) {
    console.error("[partners] Falha ao salvar proposta:", error.message);
    return { error: "Não foi possível enviar sua proposta. Tente novamente em instantes." };
  }

  const category = partnerCategories.find((item) => item.key === parsed.data.segment);
  const lines = [
    "🤝 *Nova proposta de parceiro*",
    `*Empresa:* ${parsed.data.company}`,
    `*Segmento:* ${category?.label ?? parsed.data.segment}`,
    `*Responsável:* ${parsed.data.contact}`,
    `*WhatsApp:* ${parsed.data.whatsapp}`,
    parsed.data.benefit ? `*Benefício:* ${parsed.data.benefit}` : "",
  ].filter(Boolean).join("\n");

  await Promise.allSettled([
    createPartnerProposalInNotion({ company: parsed.data.company, categoryLabel: category?.label ?? null, contact: parsed.data.contact, whatsapp: parsed.data.whatsapp, benefit: parsed.data.benefit ?? "", logoUrl: logo.url }),
    notifyRocketChat(lines, logo.url),
  ]);

  return { success: true };
}
