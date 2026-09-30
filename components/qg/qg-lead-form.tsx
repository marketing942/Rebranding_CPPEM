"use client";

import { ArrowRight, CheckCircle2, LoaderCircle, Lock, MessageCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { submitQgLead, type QgLeadState } from "@/app/qg/actions";
import { qgWhatsappGroupUrl } from "@/lib/constants";
import { PIXELX_CONTACT, PIXELX_LEAD, pixelContact, track, trackWhatsapp } from "@/lib/tracking";

const initialState: QgLeadState = {};
// tempo para o visitante ler a confirmacao e os eventos sairem antes de trocar de pagina
const REDIRECT_MS = 1800;

export function QgLeadForm() {
  const [state, formAction, pending] = useActionState(submitQgLead, initialState);

  useEffect(() => {
    if (!state.success) return;
    track("qg_cadastro", { lead_source: "qg" });
    // redirect por JS nao tem clique marcado: o Contact do PixelX vai na mao
    trackWhatsapp("qg");
    void pixelContact();
    const timeout = window.setTimeout(() => window.location.assign(qgWhatsappGroupUrl), REDIRECT_MS);
    return () => window.clearTimeout(timeout);
  }, [state.success]);

  if (state.success) {
    return <div className="qg-form-success" role="status">
      <CheckCircle2 size={40} aria-hidden="true" />
      <strong>Você está dentro do QG.</strong>
      <span>Abrindo o grupo no WhatsApp… Se não abrir sozinho, toque no botão.</span>
      <a className={`gold-button ${PIXELX_CONTACT}`} href={qgWhatsappGroupUrl} onClick={() => trackWhatsapp("qg_botao")}>
        <MessageCircle size={18} /> Entrar no grupo agora
      </a>
    </div>;
  }

  return <form action={formAction} className={`qg-form ${PIXELX_LEAD}`}>
    <div className="qg-form-head">
      <span>Acesso gratuito</span>
      <strong>Entre para o QG</strong>
      <p>Preencha seus dados e receba o link do grupo na hora.</p>
    </div>

    <label htmlFor="qg-name">Nome</label>
    <input id="qg-name" name="name" autoComplete="name" minLength={2} required placeholder="Como podemos chamar você?" />
    {state.fieldErrors?.name && <small className="qg-field-error">{state.fieldErrors.name[0]}</small>}

    <label htmlFor="qg-email">E-mail</label>
    <input id="qg-email" name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
    {state.fieldErrors?.email && <small className="qg-field-error">{state.fieldErrors.email[0]}</small>}

    <label htmlFor="qg-phone">WhatsApp</label>
    <input id="qg-phone" className="pxa_mask_phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="(81) 99999-9999" />
    {state.fieldErrors?.phone && <small className="qg-field-error">{state.fieldErrors.phone[0]}</small>}

    <div className="qg-honeypot" aria-hidden="true"><label htmlFor="qg-website">Site</label><input id="qg-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {state.error && <p className="qg-form-error" role="alert">{state.error}</p>}

    <button className="gold-button" type="submit" disabled={pending}>
      {pending ? <><LoaderCircle className="qg-spinner" size={18} /> Enviando</> : <>Quero entrar no QG <ArrowRight size={18} /></>}
    </button>
    <small className="qg-privacy"><Lock size={12} aria-hidden="true" /> 100% gratuito. Seus dados não são publicados e você sai do grupo quando quiser.</small>
  </form>;
}
