"use client";

import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Rastreamento herdado do site anterior, com os mesmos nomes de proposito: as
 * tags e os gatilhos ja configurados no GTM (GTM-PJ379FLQ, servido por
 * sgtm.cppem.com.br) procuram exatamente estes eventos e estas classes.
 *
 * O PixelX e carregado pelo proprio GTM e liga as conversoes a dois seletores:
 * - PIXELX_LEAD vai no <form> que capta lead (dispara "Lead" no envio);
 * - PIXELX_CONTACT vai no link que efetivamente abre o WhatsApp ("Contact").
 * Botao que so abre modal nao leva a classe de contato, senao a conversao infla.
 */
export const PIXELX_LEAD = "IPEyzyfmJhKQEYIXAlZH";
export const PIXELX_CONTACT = "qfnwlkdmrihaavhfxncy";

type PixelX = { send_event: (dados: Record<string, unknown>) => Promise<unknown> | unknown };

export function track(event: string, dados: Record<string, unknown> = {}) {
  try { sendGTMEvent({ event, ...dados }); } catch {}
}

/** Mesmo evento do site anterior para qualquer clique que leva ao WhatsApp. */
export function trackWhatsapp(leadSource: string) {
  track("whatsapp_click", { lead_source: leadSource });
}

/**
 * Redirecionamento por JS nao passa por clique em elemento marcado, entao o
 * PixelX nao ve o "Contact" sozinho: o disparo manual cobre esse caso.
 */
export async function pixelContact() {
  const pixel = (window as unknown as { pixel_x_app?: PixelX }).pixel_x_app;
  try { await pixel?.send_event({ event_name: "Contact" }); } catch {}
}
