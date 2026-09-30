"use client";

import type { AnchorHTMLAttributes } from "react";
import { PIXELX_CONTACT, trackWhatsapp } from "@/lib/tracking";

/**
 * Link que abre o WhatsApp ja marcado para o PixelX (conversao "Contact") e com
 * o evento whatsapp_click no GTM. Serve para as paginas de servidor, que nao
 * podem ter onClick proprio.
 */
export function WhatsappLink({ leadSource, className, onClick, ...resto }: AnchorHTMLAttributes<HTMLAnchorElement> & { leadSource: string }) {
  return <a {...resto}
    className={[className, PIXELX_CONTACT].filter(Boolean).join(" ")}
    onClick={(evento) => { trackWhatsapp(leadSource); onClick?.(evento); }} />;
}
