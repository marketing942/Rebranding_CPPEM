"use server";

import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const presencialLeadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Use até 120 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z.string().trim()
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Informe seu WhatsApp com DDD.")
    .refine((value) => value.replace(/\D/g, "").length <= 15, "Confira o número informado."),
});

export type PresencialLeadState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitPresencialLead(
  _state: PresencialLeadState | null,
  formData: FormData,
): Promise<PresencialLeadState> {
  if (String(formData.get("website") ?? "").trim()) return { success: true };

  const parsed = presencialLeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { error: "Serviço temporariamente indisponível. Tente novamente." };

  const { error } = await supabase.from("leads").insert({
    source: "turmas",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: "Caruaru",
    competition: null,
  });

  if (error) {
    console.error("[presencial] Falha ao registrar lead:", error.message);
    return { error: "Não foi possível enviar seus dados. Tente novamente em instantes." };
  }

  return { success: true };
}
