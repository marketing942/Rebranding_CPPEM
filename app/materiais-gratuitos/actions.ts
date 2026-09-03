"use server";

import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  source: z.enum(["material_gratuito", "edital_verticalizado"]),
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z.string().trim().refine((value) => value.replace(/\D/g, "").length >= 10, "Informe seu WhatsApp com DDD."),
});

export type DownloadLeadState = { success?: boolean; error?: string; fieldErrors?: Record<string, string[]> };

export async function submitDownloadLead(_state: DownloadLeadState | null, formData: FormData): Promise<DownloadLeadState> {
  if (String(formData.get("website") ?? "").trim()) return { success: true };
  const parsed = schema.safeParse({ source: formData.get("source"), name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { error: "Serviço temporariamente indisponível." };
  const { error } = await supabase.from("leads").insert({ ...parsed.data, city: null, competition: null });
  if (error) {
    console.error("[free-content] Falha ao registrar lead:", error.message);
    return { error: "Não foi possível liberar o download. Tente novamente." };
  }
  return { success: true };
}
