import type { Metadata } from "next";
import { BookMarked } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FreePageHero } from "@/components/free-content/free-page-hero";
import { GlossaryDirectory } from "@/components/free-content/glossary-directory";
import { glossaryExpressions, glossarySections, glossaryTotal } from "@/lib/glossary-content";
import { siteUrl } from "@/lib/constants";

export const metadata: Metadata = { title: "Glossário do concurseiro", description: "Termos de concursos públicos, editais e preparação explicados de forma direta.", alternates: { canonical: "/glossario" } };

export default function GlossaryPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Glossário do Concurseiro — CPPEM", url: `${siteUrl}/glossario`, inLanguage: "pt-BR", hasDefinedTerm: [...glossarySections.flatMap((section) => section.entries), ...glossaryExpressions].map((entry) => ({ "@type": "DefinedTerm", name: entry.term, description: entry.definition })) };
  return <div className="page-shell"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <FreePageHero icon={BookMarked} eyebrow="Inteligência de prova" title="Entenda a linguagem antes de enfrentar a " accent="missão." description="Termos de edital, preparação e carreira policial explicados de forma direta. Pesquise e encontre a resposta sem abandonar seu plano de estudo." count={glossaryTotal} />
    <section className="glossary-section"><div className="container"><GlossaryDirectory sections={glossarySections} expressions={glossaryExpressions} /></div></section>
  </main><SiteFooter /></div>;
}
