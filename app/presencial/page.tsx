import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarCheck2, ChartNoAxesCombined, Check, Compass, Crosshair, GraduationCap, Home, Map, MapPin, ShieldCheck, Target, Users } from "lucide-react";
import { AnimatedStat } from "@/components/about/animated-stat";
import { StudentProof } from "@/components/home/student-proof";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PresencialLeadForm } from "@/components/presencial/presencial-lead-form";
import { PresencialBenefits } from "@/components/presencial/presencial-benefits";
import { approvedStudentImages } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Curso Presencial em Caruaru",
  description: "Preparação presencial do CPPEM em Caruaru para carreiras policiais e PMPE, com aulas, cronograma e acompanhamento.",
  alternates: { canonical: "/presencial" },
};

const classes = [
  {
    tag: "Núcleo duro",
    name: "Carreiras Policiais",
    description: "A turma que estuda as matérias que representam a base das provas policiais — conteúdo que se repete edital após edital.",
    targets: ["Polícia Militar", "Polícia Civil", "Polícia Penal", "Polícia Federal"],
  },
  {
    tag: "Turma avançada",
    name: "PMPE",
    description: "Preparação focada no concurso da Polícia Militar de Pernambuco, para quem já tem base e precisa avançar com profundidade.",
    targets: ["Polícia Militar de Pernambuco"],
  },
] as const;

const obstacles = [
  { icon: Home, title: "Foco que não se sustenta em casa", copy: "Sem horário e ambiente definidos, o estudo sempre acaba ficando para depois." },
  { icon: Users, title: "Dúvidas sem resposta", copy: "Uma questão trava a matéria inteira quando não há professor ou monitor por perto." },
  { icon: Compass, title: "Falta de direção", copy: "Muitas matérias e nenhum plano claro tornam difícil saber onde concentrar energia." },
  { icon: CalendarCheck2, title: "Rotina desorganizada", copy: "Material espalhado e revisão sem cadência impedem uma evolução consistente." },
] as const;

const ecosystem = [
  { icon: Target, eyebrow: "Direção exclusiva", title: "Mentoria individual", copy: "Uma estratégia construída para o seu momento, sua rotina e seu concurso.", href: "https://individual.cppem.com.br" },
  { icon: GraduationCap, eyebrow: "Formação superior", title: "Faculdade EAD", copy: "Graduação a distância para transformar requisito em oportunidade de carreira.", href: "https://contato.unicive.cppem.com.br" },
  { icon: ShieldCheck, eyebrow: "Conclua seus estudos", title: "Supletivo", copy: "O caminho para concluir a escolaridade e seguir avançando nos seus objetivos.", href: "https://supletivo.cppem.com.br" },
] as const;

const presencialPlatformFeatures = [
  { position: "missions", title: "Missões diárias", description: "Abra o painel e saiba exatamente o que estudar naquele dia.", Icon: CalendarCheck2 },
  { position: "plan", title: "Plano de combate", description: "Cronograma conectado ao seu objetivo e à rotina da turma.", Icon: Map },
  { position: "arsenal", title: "Arsenal de fogo", description: "Aulas, PDFs, questões e simulados reunidos por disciplina.", Icon: Crosshair },
  { position: "summaries", title: "Resumos e mapas mentais", description: "Recursos de revisão para recuperar conteúdo com rapidez.", Icon: BrainCircuit },
  { position: "performance", title: "Desempenho operacional", description: "Acompanhe acertos, constância e evolução durante a preparação.", Icon: ChartNoAxesCombined },
] as const;

const whatsappHref = "https://api.whatsapp.com/send/?phone=558173105354&text=Gostaria+de+Saber+mais+sobre+os+Planos+Presenciais&type=phone_number&app_absent=0";

export default function PresencialPage() {
  return <div className="page-shell presencial-page"><SiteHeader /><main>
    <section className="presencial-hero" id="inscricao">
      <Image className="presencial-hero-image" src="/images/bannerpresencial.png" alt="" width={1916} height={821} priority sizes="100vw" />
      <div className="presencial-hero-overlay" aria-hidden="true" />
      <div className="presencial-grid" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="container presencial-hero-layout">
        <div className="presencial-hero-copy">
          <span className="eyebrow">Presencial CPPEM · Caruaru–PE</span>
          <h1>Estude presencial em <span>Caruaru</span> e vista a farda</h1>
          <p>Professor na sua frente, turma ao seu lado e uma rotina construída para levar sua preparação até a prova.</p>
          <ul>
            <li><ShieldCheck size={18} /> Aulas presenciais</li>
            <li><CalendarCheck2 size={18} /> Cronograma organizado</li>
            <li><Users size={18} /> Monitores, professores e turma na mesma missão</li>
          </ul>
          <a className="presencial-location" href="https://www.google.com/maps/search/?api=1&query=CPPEM+Caruaru+PE" target="_blank" rel="noreferrer"><MapPin size={18} /> Unidade em Caruaru–PE <ArrowRight size={15} /></a>
        </div>
        <PresencialLeadForm />
      </div>
    </section>

    <section className="presencial-classes-section" id="turmas"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">Turmas abertas hoje</span><h2 className="display-title">Escolha a turma que <span className="gold">te aprova.</span></h2><p>Duas frentes presenciais em Caruaru, cada uma desenhada para um objetivo diferente.</p></div>
      <div className="presencial-class-grid">{classes.map((course, index) => <article className="presencial-class-card" key={course.name}>
        <div className="presencial-card-number">0{index + 1}</div><span className="presencial-card-tag">{course.tag}</span><h3>{course.name}</h3><p>{course.description}</p>
        <ul>{course.targets.map((target) => <li key={target}><Target size={14} /> {target}</li>)}</ul>
        <a className="gold-button" href={whatsappHref}>Quero a turma {course.name} <ArrowRight size={17} /></a>
      </article>)}</div>
    </div></section>

    <section className="presencial-proof-section"><div className="container presencial-centered-heading"><span className="eyebrow">Prova real</span><h2 className="display-title">Alunos que já <span className="gold">vestiram a farda.</span></h2><p>Resultados reais de quem passou pela preparação CPPEM.</p></div>
      <StudentProof images={approvedStudentImages} />
      <div className="container presencial-stats">
        <AnimatedStat prefix="+" start={1000} end={14000} label="alunos aprovados" />
        <article className="about-stat"><strong>Caruaru–PE</strong><span>unidade presencial</span></article>
        <AnimatedStat start={1} end={7} suffix="+" label="anos Guiando Futuros" duration={1500} />
      </div>
    </section>

    <section className="presencial-benefits-section"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">O que você recebe</span><h2 className="display-title">Tudo que vem junto com a <span className="gold">sua vaga.</span></h2><p>Não é só a aula. São doze frentes de apoio operando juntas, da primeira semana até a prova.</p></div>
      <PresencialBenefits />
    </div></section>

    <section className="presencial-platform-section"><div className="container presencial-centered-heading"><span className="eyebrow">Plataforma de estudos</span><h2 className="display-title">Sua vaga também é acesso à <span className="gold">plataforma.</span></h2><p>Toda aula presencial fica gravada, e o restante da sua rotina de estudo continua dentro do ambiente CPPEM.</p></div>
      <div className="container presencial-platform-stage">
        <span className="presencial-platform-halo" aria-hidden="true" />
        <div className="presencial-platform-window">
          <div className="about-platform-bar" aria-hidden="true"><span/><span/><span/><strong>Painel do aluno CPPEM</strong></div>
          <Image src="/images/plataforma-cppem2.png" alt="Painel do aluno CPPEM com missões, evolução e ferramentas de estudo" width={1599} height={778} />
        </div>
        <div className="about-platform-callouts presencial-platform-callouts">
          {presencialPlatformFeatures.map(({ position, title, description, Icon }) => <article className={`about-platform-callout about-platform-${position}`} key={title}>
            <span className="about-platform-icon"><Icon size={18} /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </article>)}
        </div>
      </div>
      <div className="container presencial-platform-features">{["Cronograma diário", "Aulas gravadas", "Simulados e questões", "Painel de evolução", "Metas e gamificação", "Material de apoio"].map((feature) => <span key={feature}><Check size={15} /> {feature}</span>)}</div>
    </section>

    <section className="presencial-obstacles-section"><div className="container">
      <div className="presencial-centered-heading"><span className="eyebrow">Onde você trava hoje</span><h2 className="display-title">O que separa você da <span className="gold">farda.</span></h2><p>Se você se reconhece nesses pontos, o problema pode não ser esforço — pode ser falta de estrutura e direção.</p></div>
      <div className="presencial-obstacles-grid">{obstacles.map(({ icon: Icon, title, copy }, index) => <article key={title}><span>0{index + 1}</span><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <div className="presencial-obstacles-answer"><span>Dentro da sala</span><p>Você encontra horário, professor, cronograma e pessoas avançando ao seu lado.</p><a className="gold-button" href="#inscricao">Quero mudar minha preparação <ArrowRight size={17} /></a></div>
    </div></section>

    <section className="presencial-ecosystem-section"><div className="container">
      <div className="presencial-ecosystem-heading"><div><span className="eyebrow">Ecossistema CPPEM</span><h2 className="display-title">Outros caminhos para <span className="gold">avançar.</span></h2></div><p>Cada objetivo pede uma rota. Escolha a solução que resolve o próximo passo da sua jornada.</p></div>
      <div className="presencial-ecosystem-grid">{ecosystem.map(({ icon: Icon, eyebrow, title, copy, href }) => <Link href={href} target="_blank" rel="noreferrer" key={title}><Icon size={25} /><small>{eyebrow}</small><h3>{title}</h3><p>{copy}</p><strong>Conhecer agora <ArrowRight size={17} /></strong></Link>)}</div>
    </div></section>
  </main><SiteFooter /></div>;
}
