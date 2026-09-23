import type { Metadata } from "next";
import { Handshake, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PartnerDirectory } from "@/components/partners/partner-directory";
import { PartnerForm } from "@/components/partners/partner-form";
import { getPartners } from "@/lib/notion/partners";
import { partnerCategories } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Rede de Parceiros",
  description: "Conheça empresas parceiras e benefícios exclusivos para alunos e para a comunidade CPPEM.",
  alternates: { canonical: "/parceiros" },
};
export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const partners = await getPartners();

  return <div className="page-shell"><SiteHeader /><main>
    <section className="partners-hero"><div className="partners-hero-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div><div className="container partners-hero-content">
      <div className="partners-hero-copy"><span className="eyebrow">Rede CPPEM</span><h1>Benefícios que acompanham sua <span>jornada.</span></h1><p>Uma rede selecionada para cuidar da preparação, do desempenho e da rotina de quem decidiu avançar.</p><div className="partners-hero-actions"><a className="gold-button" href="#rede">Explorar parceiros</a><a className="ghost-button" href="#seja-parceiro">Quero ser parceiro</a></div></div>
      <div className="partners-radar" aria-hidden="true"><span className="partners-radar-ring ring-one" /><span className="partners-radar-ring ring-two" /><span className="partners-radar-ring ring-three" /><span className="partners-radar-core"><Handshake size={54} /></span></div>
    </div></section>

    <section className="partners-directory-section" id="rede"><div className="container"><div className="partners-section-heading"><div><span className="eyebrow">Conexões selecionadas</span><h2 className="display-title">Encontre o benefício <span className="gold">certo.</span></h2></div><p></p></div><PartnerDirectory partners={partners} categories={partnerCategories} /></div></section>

    <section className="partners-form-section" id="seja-parceiro"><div className="container partners-form-layout">
      <div className="partners-form-intro"><span className="eyebrow">Faça parte da rede</span><h2 className="display-title">Sua empresa, perto de uma comunidade que <span className="gold">avança.</span></h2><p>Envie sua proposta uma única vez. Ela entra na triagem do CPPEM e nossa equipe avalia o encaixe antes da publicação.</p><div className="partners-process">
        <div><Radar size={20} /><span><strong>01 · Proposta</strong><small>Você apresenta a empresa e o benefício.</small></span></div>
        <div><ShieldCheck size={20} /><span><strong>02 · Curadoria</strong><small>A equipe valida a parceria e as condições.</small></span></div>
        <div><Sparkles size={20} /><span><strong>03 · Publicação</strong><small>Parceiros aprovados entram na rede oficial.</small></span></div>
      </div></div>
      <div className="partners-form-panel"><div className="partners-form-panel-head"><span>Pré-cadastro</span><strong>Quero ser parceiro</strong></div><PartnerForm /></div>
    </div></section>
  </main><SiteFooter /></div>;
}
