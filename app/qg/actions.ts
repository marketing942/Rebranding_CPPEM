"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const qgLeadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Use até 120 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z.string().trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Informe seu WhatsApp com DDD.")
    .refine((value) => value.replace(/\D/g, "").length <= 15, "Confira o número informado."),
});

export type QgLeadState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Mesma planilha e mesma aba do site anterior: o comercial continua recebendo
 * os leads do QG onde ja trabalha (aba QG -> Venda_Direta no Apps Script).
 */
const PLANILHA_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxdFplWVSfhTjvyIA7HIWb645xRjGNhBVhTdTf5UMjo0lSpW_A_jCuys0qB4uImKXPQ/exec";

type LeadEspelhado = { name: string; email: string; phone: string; pagina_url: string; utm_source: string; utm_campaign: string };

async function contextoDaPagina() {
  try {
    // num POST de server action o referer e a pagina de onde o visitante enviou, com as UTMs
    const referer = (await headers()).get("referer") ?? "";
    if (!referer) return { pagina_url: "", utm_source: "", utm_campaign: "" };
    const url = new URL(referer);
    return { pagina_url: referer, utm_source: url.searchParams.get("utm_source") ?? "", utm_campaign: url.searchParams.get("utm_campaign") ?? "" };
  } catch {
    return { pagina_url: "", utm_source: "", utm_campaign: "" };
  }
}

async function espelharNaPlanilha(lead: LeadEspelhado) {
  try {
    const resposta = await fetch(`${PLANILHA_ENDPOINT}?aba=QG`, {
      method: "POST",
      // text/plain evita o preflight; o Apps Script le o corpo cru e faz o JSON.parse
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ nome: lead.name, email: lead.email, telefone: lead.phone, pagina_url: lead.pagina_url, utm_source: lead.utm_source, utm_campaign: lead.utm_campaign }),
      signal: AbortSignal.timeout(10_000),
    });
    const corpo = await resposta.text();
    // o Apps Script responde 200 mesmo quando recusa: quem diz se gravou e o status do JSON
    if (!resposta.ok || (JSON.parse(corpo) as { status?: string }).status !== "ok") {
      console.error(`[qg] Planilha recusou o lead: HTTP ${resposta.status} ${corpo.slice(0, 300)}`);
    }
  } catch (erro) {
    // o lead ja esta no Supabase e o visitante ja recebeu a resposta
    console.error("[qg] Falha ao copiar o lead para a planilha:", erro instanceof Error ? erro.message : erro);
  }
}

export async function submitQgLead(_state: QgLeadState | null, formData: FormData): Promise<QgLeadState> {
  if (String(formData.get("website") ?? "").trim()) return { success: true };

  const parsed = qgLeadSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { error: "Serviço temporariamente indisponível. Tente novamente." };

  const { error } = await supabase.from("leads").insert({
    source: "qg",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: null,
    competition: null,
  });

  if (error) {
    console.error("[qg] Falha ao registrar lead:", error.message);
    return { error: "Não foi possível enviar seus dados. Tente novamente em instantes." };
  }

  const contexto = await contextoDaPagina();
  after(() => espelharNaPlanilha({ ...parsed.data, ...contexto }));
  return { success: true };
}
