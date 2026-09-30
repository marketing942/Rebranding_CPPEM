import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LifeBuoy } from "lucide-react";
import { SOCIAL_LINKS, SocialIcon } from "@/components/layout/social-icons";
import { WhatsappLink } from "@/components/tracking/whatsapp-link";

const columns = [
  { title:"Navegar", links:[["Quem somos","/quem-somos"],["Concursos","/concursos"],["Notícias","/noticias"],["Parceiros","/parceiros"]] },
  { title:"Preparações", links:[["Produtos","/produtos"],["Plano de combate","/plano-de-combate"],["Presencial","/presencial"],["Loja","https://cppem.lojaintegrada.com.br"]] },
  { title:"Conteúdo gratuito", links:[["Glossário","/glossario"],["Editais verticalizados","/editais"],["Materiais gratuitos","/materiais-gratuitos"],["QG CPPEM","/qg"],["Eventos","/eventos"]] },
] as const;

export function SiteFooter() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid"><div><Image className="footer-brand" src="/brand/logo-cppem.png" alt="CPPEM" width={700} height={253}/><p className="footer-copy">Preparação estratégica para carreiras policiais, com direção de estudos, conteúdo objetivo e uma comunidade que avança junto.</p><a className="footer-help" href="https://central-de-ajuda.cppem.com.br" target="_blank" rel="noreferrer"><LifeBuoy size={20} aria-hidden="true"/><span><small>Acesso, pagamento ou aulas?</small><strong>Central de Ajuda</strong></span><ArrowUpRight size={17} aria-hidden="true"/></a></div>
      {columns.map((column) => <div key={column.title}><h2 className="footer-title">{column.title}</h2><div className="footer-links">{column.links.map(([label,href]) => <Link key={label} href={href}>{label}</Link>)}</div></div>)}
    </div>
    <div className="footer-social"><div><h2 className="footer-title">Acompanhe o CPPEM</h2><p>Conteúdo, bizus e avisos de edital todos os dias nas nossas redes.</p></div>
      <ul>{SOCIAL_LINKS.map(({ key, label, href }) => <li key={key}>{key === "whatsapp"
        ? <WhatsappLink className="footer-social-link" href={href} target="_blank" rel="noreferrer" leadSource="rodape" aria-label={`${label} do CPPEM`}><SocialIcon name={key} /><span>{label}</span></WhatsappLink>
        : <a className="footer-social-link" href={href} target="_blank" rel="noreferrer" aria-label={`${label} do CPPEM`}><SocialIcon name={key} /><span>{label}</span></a>}</li>)}</ul>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} CPPEM Concursos Públicos.</span><span>Caruaru — Pernambuco</span></div>
  </div></footer>;
}
