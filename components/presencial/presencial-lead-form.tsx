"use client";

import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { submitPresencialLead, type PresencialLeadState } from "@/app/presencial/actions";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=558173105354&text=Gostaria+de+Saber+mais+sobre+os+Planos+Presenciais&type=phone_number&app_absent=0";
const initialState: PresencialLeadState = {};

export function PresencialLeadForm() {
  const [state, formAction, pending] = useActionState(submitPresencialLead, initialState);

  useEffect(() => {
    if (!state.success) return;
    const timeout = window.setTimeout(() => window.location.assign(WHATSAPP_URL), 350);
    return () => window.clearTimeout(timeout);
  }, [state.success]);

  if (state.success) {
    return <div className="presencial-form-success" role="status">
      <CheckCircle2 size={36} aria-hidden="true" />
      <strong>Cadastro recebido.</strong>
      <span>Abrindo o atendimento no WhatsApp…</span>
    </div>;
  }

  return <form action={formAction} className="presencial-form IPEyzyfmJhKQEYIXAlZH">
    <div className="presencial-form-head">
      <span>Atendimento presencial</span>
      <strong>Reserve seu contato</strong>
      <p>Preencha os dados e fale com a equipe sobre turmas, horários e planos.</p>
    </div>

    <label htmlFor="presencial-name">Nome</label>
    <input id="presencial-name" name="name" autoComplete="name" minLength={2} required placeholder="Como podemos chamar você?" />
    {state.fieldErrors?.name && <small className="presencial-field-error">{state.fieldErrors.name[0]}</small>}

    <label htmlFor="presencial-email">E-mail</label>
    <input id="presencial-email" name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
    {state.fieldErrors?.email && <small className="presencial-field-error">{state.fieldErrors.email[0]}</small>}

    <label htmlFor="presencial-phone">WhatsApp</label>
    <input id="presencial-phone" className="pxa_mask_phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="(81) 99999-9999" />
    {state.fieldErrors?.phone && <small className="presencial-field-error">{state.fieldErrors.phone[0]}</small>}

    <div className="presencial-honeypot" aria-hidden="true"><label htmlFor="presencial-website">Site</label><input id="presencial-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {state.error && <p className="presencial-form-error" role="alert">{state.error}</p>}

    <button className="gold-button" type="submit" disabled={pending}>
      {pending ? <><LoaderCircle className="presencial-spinner" size={18} /> Enviando</> : <>Quero conhecer os planos <ArrowRight size={18} /></>}
    </button>
    <small className="presencial-privacy">Ao enviar, você autoriza o contato da equipe CPPEM. Seus dados não serão publicados.</small>
  </form>;
}
