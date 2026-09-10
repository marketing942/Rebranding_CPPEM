/* eslint-disable @next/next/no-img-element -- As URLs assinadas do Notion mudam de host e não permitem uma allowlist estática. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { statusLabels, whatsappHref } from "@/lib/constants";
import { getContestBySlug, getContestRedirect, getContests } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getContests()).map((contest) => ({ slug: contest.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const contest = await getContestBySlug((await params).slug);
  if (!contest) return {};
  return {
    title: `Concurso ${contest.acronym}`,
    description: contest.summary,
    alternates: { canonical: `/concursos/${contest.slug}` },
    openGraph: { title: `Concurso ${contest.acronym} — ${contest.title}`, description: contest.summary, type: "article" },
  };
}

export default async function ContestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const contest = await getContestBySlug(slug);
  if (!contest) {
    const replacement = await getContestRedirect(slug);
    if (replacement) permanentRedirect(`/concursos/${replacement}`);
    notFound();
  }

  const preparations = contest.products?.length ? contest.products : contest.product ? [contest.product] : [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "/" },
      { "@type": "ListItem", position: 2, name: "Concursos", item: "/concursos" },
      { "@type": "ListItem", position: 3, name: contest.title, item: `/concursos/${contest.slug}` },
    ],
  };

  return <div className="page-shell"><SiteHeader/><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <section className="detail-hero"><div className="container">
      <nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link> / <Link href="/concursos">Concursos</Link> / {contest.acronym}</nav>
      <div style={{ marginTop: 22 }}><span className="contest-badge">{statusLabels[contest.status]}</span><h1 className="display-title" style={{ maxWidth: 900 }}>{contest.title}</h1><p className="section-copy" style={{ maxWidth: 760 }}>{contest.summary}</p></div>
    </div></section>

    <div className="container detail-grid">
      <article className="detail-content">
        <div className="contest-facts"><div className="fact"><span>Vagas</span><strong>{contest.openings}</strong></div><div className="fact"><span>Remuneração</span><strong>{contest.salary}</strong></div><div className="fact"><span>Banca</span><strong>{contest.examBoard}</strong></div></div>
        <h2>Sobre o concurso</h2><ReactMarkdown remarkPlugins={[remarkGfm]}>{contest.contentMd}</ReactMarkdown>
        <h2>Cargos</h2><ul>{contest.positions.map((item) => <li key={item}>{item}</li>)}</ul>
        <h2>Requisitos</h2><ul>{contest.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
        <h2>Etapas previstas</h2><ul>{contest.stages.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>

      <aside className="detail-sidebar">
        <div className="detail-panel"><h2>Informação verificada</h2><p className="map-hint">Última verificação</p><strong>{formatDate(contest.lastVerifiedAt)}</strong><p><a className="ghost-button" style={{ width: "100%" }} href={contest.sourceUrl} target="_blank" rel="noreferrer">Consultar {contest.sourceLabel}</a></p></div>
        {preparations.length ? <div className="detail-panel" style={{ borderColor: "var(--border-active)" }}><span className="product-category">Prepare-se com o CPPEM</span><h2 style={{ marginTop: 8 }}>{preparations.length} preparação(ões) disponível(is)</h2><p className="product-description">Cursos vinculados oficialmente a este concurso.</p><a className="gold-button" style={{ width: "100%" }} href="#preparacoes">Ver preparações</a></div> : <div className="detail-panel"><h2>Ainda sem preparação específica</h2><p className="product-description">Fale com nossa equipe e receba orientação sobre a melhor preparação disponível.</p><a className="whatsapp-button" style={{ width: "100%" }} href={whatsappHref(`Olá! Vim pelo site do CPPEM e quero saber sobre uma preparação para o concurso ${contest.acronym} — ${contest.title}.`)} target="_blank" rel="noreferrer">Falar no WhatsApp</a></div>}
      </aside>
    </div>

    {preparations.length > 0 && <section className="container contest-preparations" id="preparacoes">
      <div className="section-heading"><span className="eyebrow">Cursos vinculados</span><h2 className="display-title">Preparações para este <span className="gold">concurso.</span></h2><p className="section-copy">Escolha a preparação que melhor se encaixa na sua rotina e avance para conhecer todos os detalhes.</p></div>
      <div className="contest-preparation-grid">{preparations.map((course) => <Link className="contest-preparation-card" href={course.href} key={course.id}>
        <div className="contest-preparation-media"><img src={course.imageUrl} alt={course.name} width="640" height="480" loading="lazy" decoding="async" /></div>
        <div className="contest-preparation-copy"><span className="product-category">{course.modality || "Curso CPPEM"}</span><h3>{course.name}</h3>{course.description && <p>{course.description}</p>}<div><strong>{course.price}</strong><span>Conhecer curso →</span></div></div>
      </Link>)}</div>
    </section>}
  </main><SiteFooter/></div>;
}
