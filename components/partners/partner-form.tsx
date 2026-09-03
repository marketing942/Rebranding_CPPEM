"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { Check, LoaderCircle, Send, Upload } from "lucide-react";
import { submitPartnerProposal, type PartnerProposalState } from "@/app/parceiros/actions";
import { partnerCategories } from "@/lib/partners";

function ErrorMessage({ messages }: { messages?: string[] }) {
  return messages?.length ? <span className="partner-field-error">{messages[0]}</span> : null;
}

export function PartnerForm() {
  const [state, action, pending] = useActionState<PartnerProposalState | null, FormData>(submitPartnerProposal, null);
  const [logoError, setLogoError] = useState<string | null>(null);

  function validateLogo(event: ChangeEvent<HTMLInputElement>) {
    setLogoError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setLogoError("Use uma imagem PNG, JPG ou WebP.");
      event.target.value = "";
    } else if (file.size > 2 * 1024 * 1024) {
      setLogoError("A logo deve ter no máximo 2 MB.");
      event.target.value = "";
    }
  }

  if (state?.success) return <div className="partner-form-success" role="status"><span><Check size={26} /></span><h3>Proposta recebida.</h3><p>Nossa equipe fará a curadoria e entrará em contato com você.</p></div>;

  return <form action={action} className="partner-form IPEyzyfmJhKQEYIXAlZH" aria-busy={pending}>
    <div className="partner-form-grid">
      <label><span>Empresa</span><input name="empresa" minLength={2} maxLength={120} required placeholder="Nome da empresa" autoComplete="organization" /><ErrorMessage messages={state?.fieldErrors?.company} /></label>
      <label><span>Segmento</span><select name="segmento" required defaultValue=""><option value="" disabled>Selecione</option>{partnerCategories.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select><ErrorMessage messages={state?.fieldErrors?.segment} /></label>
      <label><span>Responsável</span><input name="nome_responsavel" minLength={2} maxLength={100} required placeholder="Nome do contato" autoComplete="name" /><ErrorMessage messages={state?.fieldErrors?.contact} /></label>
      <label className="pxa_mask_phone"><span>WhatsApp</span><input name="whatsapp" required inputMode="tel" placeholder="(00) 00000-0000" autoComplete="tel" /><ErrorMessage messages={state?.fieldErrors?.whatsapp} /></label>
      <label className="partner-form-wide"><span>Benefício proposto <small>opcional</small></span><textarea name="beneficio" rows={4} maxLength={1200} placeholder="Conte como sua empresa pode beneficiar a comunidade CPPEM" /><ErrorMessage messages={state?.fieldErrors?.benefit} /></label>
      <label className="partner-form-wide partner-upload"><span>Logo <small>opcional</small></span><span className="partner-upload-control"><Upload size={18} /><input name="logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={validateLogo} /><strong>PNG, JPG ou WebP · até 2 MB</strong></span>{logoError ? <span className="partner-field-error">{logoError}</span> : <ErrorMessage messages={state?.fieldErrors?.logo} />}</label>
    </div>
    <input className="partner-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {state?.error && <p className="partner-submit-error" role="alert">{state.error}</p>}
    <button className="gold-button partner-submit" type="submit" disabled={pending}>{pending ? <><LoaderCircle className="partner-spinner" size={18} />Enviando proposta</> : <>Enviar proposta <Send size={17} /></>}</button>
    <p className="partner-privacy">Ao enviar, você autoriza o contato da equipe CPPEM exclusivamente sobre esta parceria.</p>
  </form>;
}
