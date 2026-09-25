import type { Metadata } from "next";
import { CheckSquare, FileText, Target, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContentLibrary } from "@/components/free-content/content-library";
import { FreePageHero } from "@/components/free-content/free-page-hero";
import { getVerticalizedNotices } from "@/lib/notion/free-content";

export const metadata: Metadata = { title: "Editais verticalizados", description: "Editais verticalizados gratuitos para organizar sua preparação tópico a tópico.", alternates: { canonical: "/editais" } };
export const dynamic = "force-dynamic";
export default async function NoticesPage() {
  const notices = await getVerticalizedNotices();
  return <div className="page-shell"><SiteHeader /><main>
    <FreePageHero icon={FileText} eyebrow="Controle de missão" title="O edital inteiro, sem perder de vista o que " accent="importa." description="Conteúdo programático separado tópico a tópico para você marcar, medir e atacar os pontos que ainda custam sua aprovação." count={notices.length} />
    <section className="free-library-section"><div className="container"><div className="free-section-heading"><span className="eyebrow">Editais CPPEM</span><h2 className="display-title">Encontre o seu <span className="gold">concurso.</span></h2><p></p></div><ContentLibrary items={notices} kind="notices" /></div></section>
    <section className="free-method-section"><div className="container free-method-grid"><article><CheckSquare /><span>01</span><h3>Marque o que domina</h3><p>Converta cada tópico estudado em progresso visível e elimine a sensação de estar perdido.</p></article><article><TrendingUp /><span>02</span><h3>Enxergue seu avanço</h3><p>Identifique disciplinas atrasadas antes que elas se transformem em lacunas decisivas.</p></article><article><Target /><span>03</span><h3>Ataque o que mais cai</h3><p>Cruze o edital com provas anteriores e concentre energia nos temas recorrentes.</p></article></div></section>
  </main><SiteFooter /></div>;
}
