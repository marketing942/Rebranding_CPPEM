import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgePercent, BookOpenCheck, CalendarRange, ChevronDown, ClipboardCheck, FileText, MessagesSquare, Newspaper, Radio, ShieldCheck, Smartphone, Sparkles, UserPlus, Users } from "lucide-react";
import { AnimatedStat } from "@/components/about/animated-stat";
import { StudentProof } from "@/components/home/student-proof";
import { getFaixaDestaque } from "@/components/layout/contest-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QgLeadForm } from "@/components/qg/qg-lead-form";
import { approvedStudentImages } from "@/lib/mock-data";
import { formatNewsDate, getLatestNews, newsHref } from "@/lib/news";
import { getFreeMaterials } from "@/lib/notion/free-content";
import "./qg.css";

export const metadata: Metadata = {
  title: "QG CPPEM · Comunidade gratuita",
  description: "Entre no QG CPPEM: materiais gratuitos, notícias de editais, bate-papo entre concurseiros, benefícios exclusivos e lives com professores do CPPEM. Grátis, pelo WhatsApp.",
  alternates: { canonical: "/qg" },
};

// Secao 2: o que o aluno recebe (os cinco itens do QG do site anterior)
const access = [
  { icon: BookOpenCheck, title: "Materiais gratuitos", copy: "PDFs, resumos e conteúdo de apoio para manter a rotina de estudo em movimento." },
  { icon: CalendarRange, title: "Notícias de concursos", copy: "Editais, datas e movimentações importantes chegando rápido, direto no seu celular." },
  { icon: MessagesSquare, title: "Bate-papo dos concurseiros", copy: "Um espaço para trocar dúvidas, experiências e orientação com quem está na mesma missão." },
  { icon: BadgePercent, title: "Benefícios exclusivos", copy: "Condições especiais nos produtos CPPEM para quem está dentro da base do QG." },
  { icon: Radio, title: "Lives com bizus de professores", copy: "Encontros com direcionamento tático dos professores do CPPEM para a sua preparação.", wide: true },
] as const;

// Secao 3: como funciona
const steps = [
  { icon: ClipboardCheck, title: "Preencha o formulário", copy: "Nome, e-mail e WhatsApp. Leva menos de um minuto." },
  { icon: UserPlus, title: "Entre no grupo", copy: "O link do grupo abre na hora, direto no seu WhatsApp." },
  { icon: Smartphone, title: "Receba no celular", copy: "Materiais, avisos de edital e convites para as lives chegam até você." },
] as const;

// Secao 6: perguntas frequentes
const faq = [
  { q: "O QG é pago?", a: "Não. O QG CPPEM é 100% gratuito. Você só precisa preencher o formulário para receber o link do grupo." },
  { q: "Como eu entro no grupo?", a: "Assim que você envia o formulário, o link do grupo do WhatsApp abre automaticamente. Se não abrir, aparece um botão para entrar." },
  { q: "Vou receber spam?", a: "Não. O grupo é para conteúdo de concursos: materiais, notícias de editais, avisos de lives e benefícios do CPPEM." },
  { q: "Posso sair quando quiser?", a: "Pode. É só sair do grupo pelo próprio WhatsApp, a qualquer momento." },
  { q: "Para quais concursos é o QG?", a: "O foco são as carreiras policiais e da segurança pública: PM, PC, Polícia Penal, PRF, PF, Bombeiros e Guarda Municipal." },
] as const;

export default async function QgPage() {
  const [faixa, news, materials] = await Promise.all([getFaixaDestaque(), getLatestNews(3), getFreeMaterials()]);
  const latestMaterials = materials.slice(0, 3);

  return <div className="page-shell qg-page"><SiteHeader /><main>

    {/* SECAO 1 - Topo: identidade do QG + formulario */}
    <section className="qg-hero" id="entrar">
      <Image className="qg-hero-image" src="/images/qg/bg-qg.webp" alt="" width={1536} height={1024} priority sizes="100vw" />
      <div className="qg-hero-overlay" aria-hidden="true" />
      <div className="container qg-hero-layout">
        <div className="qg-hero-copy">
          <span className="eyebrow">Ecossistema CPPEM · Comunidade gratuita</span>
          <div className="qg-wordmark" aria-label="QG CPPEM">
            <Image src="/brand/emblema-leao.webp" alt="" width={400} height={465} />
            <strong>QG<span>.</span>CPPEM</strong>
          </div>
          <h1>A melhor comunidade de <span>concursos públicos</span> do Brasil.</h1>
          <p>Materiais, notícias de editais, lives com professores e benefícios exclusivos. Tudo gratuito, direto no seu WhatsApp.</p>
          <ul>
            <li><Sparkles size={18} /> 100% gratuito</li>
            <li><MessagesSquare size={18} /> Grupo no WhatsApp</li>
            <li><ShieldCheck size={18} /> Você sai quando quiser</li>
          </ul>
        </div>
        <QgLeadForm />
      </div>
    </section>

    {/* SECAO 2 - O que voce recebe */}
    <section className="qg-access-section" id="acesso"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">Dentro do QG</span><h2 className="display-title">Você terá <span className="gold">acesso a:</span></h2><p>Cinco frentes de apoio para a sua preparação, sem pagar nada por isso.</p></div>
      <div className="qg-access-grid">{access.map(({ icon: Icon, title, copy, ...rest }, index) => <article className="qg-access-card" data-wide={"wide" in rest ? true : undefined} key={title}>
        <span className="qg-access-number">0{index + 1}</span>
        <span className="qg-access-icon"><Icon size={24} /></span>
        <h3>{title}</h3>
        <p>{copy}</p>
      </article>)}</div>
    </div></section>

    {/* SECAO 3 - Como funciona */}
    <section className="qg-steps-section" id="como-funciona"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">Como funciona</span><h2 className="display-title">Três passos e você <span className="gold">está dentro.</span></h2></div>
      <ol className="qg-steps">{steps.map(({ icon: Icon, title, copy }, index) => <li key={title}>
        <span className="qg-step-number">{index + 1}</span>
        <Icon size={26} />
        <h3>{title}</h3>
        <p>{copy}</p>
      </li>)}</ol>
    </div></section>

    {/* SECAO 4 - Previa do que chega no grupo (conteudo real do site, atualiza sozinho) */}
    <section className="qg-preview-section" id="previa"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">Um gosto do QG</span><h2 className="display-title">O tipo de conteúdo que <span className="gold">chega até você.</span></h2><p>Estes são os destaques de agora. No QG, eles chegam no seu celular assim que saem.</p></div>
      {faixa && <Link className="qg-preview-strip" href={faixa.href}>
        <span>{faixa.etiqueta}</span><strong>{faixa.texto}</strong><ArrowRight size={18} />
      </Link>}
      <div className="qg-preview-grid">
        <div className="qg-preview-column">
          <h3><Newspaper size={18} /> Últimas notícias</h3>
          {news.length ? news.map((article) => <Link className="qg-preview-item" href={newsHref(article)} key={article.id} target={article.isExternal ? "_blank" : undefined} rel={article.isExternal ? "noreferrer" : undefined}>
            <small>{formatNewsDate(article.publishedAt)}</small><strong>{article.title}</strong>
          </Link>) : <p className="qg-preview-empty">As notícias aparecem aqui assim que forem publicadas.</p>}
          <Link className="qg-preview-more" href="/noticias">Ver todas as notícias <ArrowUpRight size={15} /></Link>
        </div>
        <div className="qg-preview-column">
          <h3><FileText size={18} /> Materiais gratuitos</h3>
          {latestMaterials.length ? latestMaterials.map((material) => <Link className="qg-preview-item" href="/materiais-gratuitos" key={material.id}>
            <small>{material.label || "Material gratuito"}</small><strong>{material.name}</strong>
          </Link>) : <p className="qg-preview-empty">Os materiais aparecem aqui assim que forem publicados.</p>}
          <Link className="qg-preview-more" href="/materiais-gratuitos">Ver todos os materiais <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </div></section>

    {/* SECAO 5 - Prova social */}
    <section className="presencial-proof-section qg-proof-section" id="aprovados"><div className="container presencial-centered-heading"><span className="eyebrow">Quem já passou por aqui</span><h2 className="display-title">Alunos que já <span className="gold">vestiram a farda.</span></h2><p>A comunidade é a porta de entrada. A aprovação é o destino.</p></div>
      <StudentProof images={approvedStudentImages} />
      <div className="container presencial-stats">
        <AnimatedStat prefix="+" start={1000} end={14000} label="alunos aprovados" />
        <article className="about-stat"><strong><Users size={34} /></strong><span>comunidade gratuita</span></article>
        <AnimatedStat start={1} end={7} suffix="+" label="anos Guiando Futuros" duration={1500} />
      </div>
    </section>

    {/* SECAO 6 - Perguntas frequentes */}
    <section className="qg-faq-section" id="duvidas"><div className="container qg-faq-layout">
      <div><span className="eyebrow">Dúvidas</span><h2 className="display-title">Antes de <span className="gold">entrar.</span></h2></div>
      <div className="qg-faq">{faq.map(({ q, a }) => <details key={q}><summary>{q}<ChevronDown size={18} aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
    </div></section>

    {/* SECAO 7 - Chamada final */}
    <section className="qg-final-section"><div className="container qg-final">
      <Image src="/brand/emblema-leao.webp" alt="" width={400} height={465} />
      <div><span className="eyebrow">Sua vaga no QG é gratuita</span><h2 className="display-title">Entre para o <span className="gold">QG CPPEM.</span></h2></div>
      <a className="gold-button" href="#entrar">Quero entrar no QG <ArrowRight size={18} /></a>
    </div></section>

  </main><SiteFooter /></div>;
}
