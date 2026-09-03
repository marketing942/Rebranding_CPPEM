import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function NotFound() { return <div className="page-shell"><SiteHeader/><main className="contest-hero" style={{minHeight:"60vh"}}><div className="container"><span className="eyebrow" style={{justifyContent:"center"}}>404</span><h1 className="display-title">Página não encontrada.</h1><p className="section-copy">O conteúdo pode ter mudado ou ainda não foi publicado.</p><Link className="gold-button" href="/">Voltar ao início</Link></div></main><SiteFooter/></div>; }
