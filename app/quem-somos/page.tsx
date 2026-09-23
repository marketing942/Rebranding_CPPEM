import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarCheck2, ChartNoAxesCombined, Check, Crosshair, Map, X } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StudentProof } from "@/components/home/student-proof";
import { AnimatedStat } from "@/components/about/animated-stat";
import { AboutTicker } from "@/components/about/about-ticker";
import { AboutHowItWorks } from "@/components/about/about-how-it-works";
import { approvedStudentImages } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Quem somos",
  description: "Conheça os pilares que orientam a preparação do CPPEM para concursos policiais.",
  alternates: { canonical: "/quem-somos" },
};

const platformFeatures = [
  { position: "missions", title: "Missões diárias", description: "Organize o que estudar em cada etapa da preparação.", Icon: CalendarCheck2 },
  { position: "plan", title: "Plano de combate", description: "Siga um cronograma alinhado ao seu objetivo e à sua rotina.", Icon: Map },
  { position: "arsenal", title: "Arsenal de fogo", description: "Encontre aulas, PDFs, simulados e materiais por disciplina.", Icon: Crosshair },
  { position: "summaries", title: "Resumos e mapas mentais", description: "Revise conteúdos com anotações e recursos visuais.", Icon: BrainCircuit },
  { position: "performance", title: "Desempenho operacional", description: "Acompanhe acertos, erros e a evolução dos seus estudos.", Icon: ChartNoAxesCombined },
] as const;

const comparisonRows = [
  ["Direção clara do que estudar", "Plano guiado", "Aluno segue perdido", "Só entrega a aula", "Conteúdo espalhado"],
  ["Acompanhamento de mentor", "Mentoria contínua", "Você por conta", "Sem acompanhamento", "Ninguém te guia"],
  ["Cronograma de revisões e simulados", "Estruturado para a prova", "Fica a seu critério", "Raro ou inexistente", "Você monta sozinho"],
  ["Método e didática próprios", "Didática própria", "Padrão de mercado", "Só a aula do dia", "Cada fonte é diferente"],
  ["Preparação de TAF e psicotécnico", "Dentro da trilha", "Não oferece", "Por fora, se houver", "Você se vira"],
  ["Metas, ranking e constância", "Plataforma própria", "Sem sistema de constância", "Nada além da aula", "Sem constância"],
] as const;

export default function AboutPage() {
  return <div className="page-shell">
    <SiteHeader/>
    <main>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow">Quem somos</span>
            <h1 className="about-title">
              <span className="about-title-prefix">Sua aprovação<br/>precisa de</span>
              <span className="about-word-window" aria-hidden="true">
                <span className="about-word-track">
                  <span>Mentalidade</span>
                  <span>Disciplina</span>
                  <span>Tecnica</span>
                  <span>Mentalidade</span>
                </span>
              </span>
              <span className="sr-only"> mentalidade, disciplina e técnica.</span>
            </h1>
            <p className="about-lead">Preparação estratégica para concursos policiais, unindo direcionamento, constância e domínio técnico em cada etapa da jornada.</p>
            <div className="about-actions"><Link className="gold-button" href="/cursos">Conheça as preparações <ArrowRight size={17}/></Link><Link className="ghost-button" href="/concursos">Explore os concursos</Link></div>
          </div>

          <div className="about-mark-stage" aria-hidden="true">
            <span className="about-orbit about-orbit-one"/>
            <span className="about-orbit about-orbit-two"/>
            <span className="about-mark-glow"/>
            <Image className="about-lion" src="/brand/emblema-leao.webp" alt="" width={420} height={420} priority/>
            <span className="about-axis about-axis-one">Mentalidade</span>
            <span className="about-axis about-axis-two">Disciplina</span>
            <span className="about-axis about-axis-three">Técnica</span>
          </div>
        </div>
      </section>

      <AboutTicker />

      <AboutHowItWorks />

      <section className="about-platform-section">
        <div className="container about-platform-heading">
          <span className="eyebrow">Ecossistema CPPEM</span>
          <h2 className="display-title">Uma plataforma completa para organizar sua <span className="gold">preparação.</span></h2>
          <p className="section-copy">Estratégia, conteúdo e acompanhamento reunidos em um único ambiente para você saber o que estudar, como evoluir e onde concentrar seus esforços.</p>
        </div>

        <div className="container about-platform-stage">
          <div className="about-platform-window">
            <div className="about-platform-bar" aria-hidden="true"><span/><span/><span/><strong>Painel do aluno CPPEM</strong></div>
            <Image className="about-platform-image" src="/images/plataforma-cppem2.png" alt="Painel do aluno CPPEM mostrando briefing da missão, objetivos e funcionalidades da plataforma" width={1599} height={778}/>
          </div>

          <div className="about-platform-callouts">
            {platformFeatures.map(({ position, title, description, Icon }) => <article className={`about-platform-callout about-platform-${position}`} key={title}>
              <span className="about-platform-icon"><Icon size={18}/></span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="about-approved-section">
        <div className="container about-approved-heading">
          <span className="eyebrow">Resultados reais</span>
          <h2 className="display-title">Quem aprova, <span className="gold">comprova.</span></h2>
        </div>
        <StudentProof images={approvedStudentImages}/>

        <div className="container about-approved-numbers">
          <div className="about-approved-intro"><span className="eyebrow">Nossa história</span><h3>Nossos alunos <span>aprovados</span></h3></div>
          <div className="about-stats-grid">
            <AnimatedStat prefix="+" start={1000} end={14000} label="alunos aprovados" />
            <AnimatedStat start={1} end={7} suffix="+" label="anos de estrada" duration={1500} />
            <article className="about-stat"><strong>Caruaru–PE</strong><span>unidade presencial</span></article>
          </div>
        </div>
      </section>

      <section className="about-comparison-section">
        <div className="container about-comparison-heading">
          <span className="eyebrow">Por que o CPPEM</span>
          <h2 className="display-title"><span className="gold">CPPEM</span> vs. o caminho comum</h2>
          <p className="section-copy">A diferença entre estudar muito e estudar certo até vestir a farda.</p>
        </div>

        <div className="container about-comparison-panel">
          <div className="about-comparison-scroll">
            <table className="about-comparison-table">
              <thead><tr><th>O que você precisa</th><th className="about-cppem-column">CPPEM</th><th>Cursinhos online</th><th>Cursinhos presenciais</th><th>Material da internet</th></tr></thead>
              <tbody>{comparisonRows.map(([criterion, cppem, online, inPerson, internet]) => <tr key={criterion}>
                <th scope="row">{criterion}</th>
                <td className="about-cppem-cell"><span className="about-compare-mark about-compare-yes"><Check size={15}/></span>{cppem}</td>
                <td><span className="about-compare-mark about-compare-no"><X size={15}/></span>{online}</td>
                <td><span className="about-compare-mark about-compare-no"><X size={15}/></span>{inPerson}</td>
                <td><span className="about-compare-mark about-compare-no"><X size={15}/></span>{internet}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="about-comparison-hint">Arraste para o lado para comparar todas as colunas.</p>
        </div>
      </section>
    </main>
    <SiteFooter/>
  </div>;
}
