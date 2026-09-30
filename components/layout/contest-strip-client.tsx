"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRight, Megaphone, X } from "lucide-react";

const CHAVE = "cppem-faixa-fechada";

export function ContestStripClient({ etiqueta, texto, href }: { etiqueta: string; texto: string; href: string }) {
  const rota = usePathname();
  const faixa = useRef<HTMLElement>(null);

  // a faixa ja vem no HTML e some depois, escondendo o proprio no: assim nao ha
  // pulo de layout nem divergencia entre o que o servidor e o cliente montam.
  // A chave guarda o texto, entao um aviso novo volta a aparecer para quem fechou o anterior.
  useEffect(() => {
    try { if (sessionStorage.getItem(CHAVE) === texto) faixa.current?.setAttribute("hidden", ""); } catch {}
  }, [texto]);

  if (rota.startsWith("/admin")) return null;

  const fechar = () => {
    faixa.current?.setAttribute("hidden", "");
    try { sessionStorage.setItem(CHAVE, texto); } catch {}
  };

  return <aside className="contest-strip" ref={faixa}>
    <Link className="contest-strip-link" href={href}>
      <span className="contest-strip-tag"><Megaphone size={13} aria-hidden="true" />{etiqueta}</span>
      <span className="contest-strip-text">{texto}</span>
      <span className="contest-strip-cta">Ver preparação <ArrowRight size={14} aria-hidden="true" /></span>
    </Link>
    <button type="button" aria-label="Fechar aviso" onClick={fechar}><X size={14} /></button>
  </aside>;
}
