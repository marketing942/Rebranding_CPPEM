"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowDownToLine, CheckCircle2, X } from "lucide-react";
import { submitDownloadLead, type DownloadLeadState } from "@/app/materiais-gratuitos/actions";
import type { FreeMaterial } from "@/types/free-content";

function directDownloadUrl(href: string) {
  try {
    const url = new URL(href);
    if (!url.hostname.endsWith("drive.google.com")) return href;
    const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get("id");
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : href;
  } catch { return href; }
}

export function DownloadModal({ item, onClose, source }: { item: FreeMaterial | null; onClose: () => void; source: "material_gratuito" | "edital_verticalizado" }) {
  const [state, action, pending] = useActionState<DownloadLeadState | null, FormData>(submitDownloadLead, null);
  const downloaded = useRef<string | null>(null);
  const open = Boolean(item);
  const url = item ? directDownloadUrl(item.href) : "";

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [open, onClose]);

  useEffect(() => {
    if (!state?.success || !item || downloaded.current === item.id) return;
    downloaded.current = item.id;
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.src = url;
    document.body.appendChild(frame);
    const timer = window.setTimeout(() => frame.remove(), 60_000);
    return () => window.clearTimeout(timer);
  }, [state?.success, item, url]);

  return <div className="download-modal" data-open={open} role="dialog" aria-modal="true" aria-label="Liberar download">
    <button className="download-backdrop" type="button" onClick={onClose} aria-label="Fechar" />
    <div className="download-dialog">
      <button className="download-close" type="button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
      <span className="download-icon">{state?.success ? <CheckCircle2 /> : <ArrowDownToLine />}</span>
      <span className="eyebrow">Conteúdo CPPEM</span>
      <h2>{item?.name ?? ""}</h2>
      {!state?.success ? <form action={action} className="download-form IPEyzyfmJhKQEYIXAlZH">
        <input type="hidden" name="source" value={source} />
        <label>Nome<input name="name" autoComplete="name" required placeholder="Seu nome completo" /></label>
        <small>{state?.fieldErrors?.name?.[0]}</small>
        <label>E-mail<input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" /></label>
        <small>{state?.fieldErrors?.email?.[0]}</small>
        <label className="pxa_mask_phone">WhatsApp<input name="phone" inputMode="numeric" required placeholder="(81) 99999-9999" /></label>
        <small>{state?.fieldErrors?.phone?.[0]}</small>
        <input className="download-honeypot" name="website" tabIndex={-1} autoComplete="off" />
        {state?.error && <p className="download-error">{state.error}</p>}
        <button className="gold-button" type="submit" disabled={pending}>{pending ? "Liberando..." : "Liberar download"}</button>
        <p className="download-privacy">Download gratuito e imediato. Seus dados permanecem protegidos.</p>
      </form> : <div className="download-success"><strong>Download liberado.</strong><p>O arquivo já está sendo preparado. Caso não inicie, use o acesso manual.</p><a className="gold-button" href={url} target="_blank" rel="noreferrer">Baixar manualmente</a><button type="button" onClick={onClose}>Voltar à biblioteca</button></div>}
    </div>
  </div>;
}
