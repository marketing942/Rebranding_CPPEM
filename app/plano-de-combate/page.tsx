import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Medal,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { AnimatedStat } from "@/components/about/animated-stat";
import { CombatPlatformStory } from "@/components/combat/combat-platform-story";
import { StudentProof } from "@/components/home/student-proof";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { approvedStudentImages } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Plano de Combate",
  description: "Cronograma personalizado, acompanhamento e uma plataforma completa para transformar sua rotina em preparação para concursos.",
  alternates: { canonical: "/plano-de-combate" },
};

const methodFeatures = [
  { icon: Target, title: "Orientação personalizada", copy: "A rota nasce do seu concurso, do seu nível atual e do tempo que você realmente tem disponível." },
  { icon: CalendarCheck2, title: "Planejamento diário", copy: "Cada dia chega organizado em missões claras, com disciplina, conteúdo e prioridade definidos." },
  { icon: FileText, title: "Material exclusivo", copy: "Aulas, PDFs, questões e recursos de revisão reunidos no mesmo fluxo de estudo." },
  { icon: Users, title: "Mentoria especializada", copy: "Professores e mentores ajudam a corrigir a rota antes que uma dificuldade vire atraso." },
  { icon: MessageCircle, title: "Comunidade em missão", copy: "Você avança ao lado de alunos que perseguem o mesmo objetivo e entendem o processo." },
  { icon: ClipboardCheck, title: "Simulados e correções", copy: "Desempenho acompanhado por dados para transformar erros em decisões de estudo." },
] as const;

const plans = [
  {
    eyebrow: "Entrada estratégica",
    name: "Operacional",
    description: "Para quem precisa sair da desorganização e começar a executar uma rotina inteligente.",
    monthlyPrice: "R$ 61,03",
    fullPrice: "R$ 597 à vista",
    href: "https://pxa.cppem.com.br/lt/plano-de-combate-operacional",
    cta: "Quero o Operacional",
    featured: false,
    features: [
      "Cronograma personalizado e individualizado",
      "Metas diárias com videoaulas, PDFs e questões",
      "Relatórios semanais de progresso",
      "Ranking de estudos e simulados",
      "Grupo VIP de apoio ao aluno",
      "Inteligência artificial para auxiliar nos estudos",
    ],
  },
  {
    eyebrow: "Mais escolhido",
    name: "Tático",
    description: "Para quem quer unir planejamento, conteúdo completo e contato recorrente com os mentores.",
    monthlyPrice: "R$ 101,93",
    fullPrice: "R$ 997 à vista",
    href: "https://pxa.cppem.com.br/lt/plano-de-combate-tatico",
    cta: "Quero o Tático",
    featured: true,
    features: [
      "Tudo do Plano Operacional",
      "Mentorias ao vivo mensais",
      "Acesso aos cursos da plataforma",
      "Mudança de curso sempre que necessário",
      "Acesso às aulas e aos materiais didáticos",
      "Preparação de TAF, psicotécnico e método MDT",
    ],
  },
  {
    eyebrow: "Arsenal completo",
    name: "Supremo",
    description: "Para quem busca o nível máximo de acompanhamento e materiais estratégicos CPPEM.",
    monthlyPrice: "R$ 204,16",
    fullPrice: "R$ 1.997 à vista",
    href: "https://pxa.cppem.com.br/lt/plano-de-combate-supremo",
    cta: "Quero o Supremo",
    featured: false,
    features: [
      "Tudo dos planos Operacional e Tático",
      "Acesso a matérias extras",
      "Resumo Bizurado Carreiras Policiais digital",
      "Vade-Mécum Tático digital",
      "Caderno de Treinamento Tático digital",
      "Redação Bizurada digital",
    ],
  },
] as const;

export default function PlanoDeCombatePage() {
  return <div className="page-shell combat-page"><SiteHeader /><main>
    <section className="combat-hero">
      <Image src="/images/plano-combate/bgsniper.webp" alt="" fill priority sizes="100vw" className="combat-hero-image" />
      <div className="combat-hero-overlay" />
      <div className="container combat-hero-content">
        <div className="combat-hero-emblem"><Image src="/brand/emblema-leao.webp" alt="" width={84} height={84} /></div>
        <span className="combat-kicker">Plano de Combate CPPEM</span>
        <h1>A prova é individual.<br/><span>A estratégia não precisa ser.</span></h1>
        <p>Você entra com o objetivo. Nós organizamos a rota, o ritmo e o acompanhamento para transformar intenção em execução diária.</p>
        <div className="combat-hero-actions">
          <a className="gold-button" href="#planos">Escolher meu plano <ArrowRight size={18}/></a>
          <a className="combat-text-link" href="#metodo">Entender como funciona <ArrowDown size={17}/></a>
        </div>
      </div>
      <a className="combat-scroll-cue" href="#cronograma" aria-label="Ir para a próxima seção"><ArrowDown size={20}/></a>
    </section>

    <section className="combat-work-section" id="cronograma"><div className="container">
      <div className="combat-section-heading combat-centered-heading">
        <span className="eyebrow">Seu plano. Sua rotina.</span>
        <h2 className="display-title">Faremos o trabalho pesado <span className="gold">para você.</span></h2>
        <p>O Plano de Combate transforma o seu concurso, disponibilidade e desempenho em uma sequência clara de missões. Você abre a plataforma e sabe o que fazer.</p>
      </div>

      <CombatPlatformStory />
    </div></section>

    <section className="combat-method-section" id="metodo"><div className="container combat-method-layout">
      <div className="combat-method-copy"><span className="eyebrow">O que é o Plano de Combate?</span><h2 className="display-title">A melhor forma de estudar <span className="gold">para concurso.</span></h2><p>É uma metodologia de preparação contínua que reúne planejamento, conteúdo e acompanhamento dentro da mesma plataforma. Em vez de decidir todos os dias o que estudar, você executa uma rota construída para o seu objetivo — e ajustada conforme sua evolução.</p><blockquote>“Estudar certo é melhor do que estudar muito.”</blockquote><a className="ghost-button" href="#planos">Ver os planos <ArrowRight size={17}/></a></div>
      <div className="combat-method-grid">{methodFeatures.map(({icon:Icon,title,copy},index)=><article key={title}><span className="combat-feature-number">0{index+1}</span><div className="combat-feature-icon"><Icon size={22}/></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div></section>

    <section className="combat-mentor-section"><div className="container combat-mentor-layout">
      <div className="combat-mentor-portrait"><Image src="/images/plano-combate/everton-mentor.jpg" alt="Everton Mota, mentor do Plano de Combate" width={1000} height={1250} sizes="(max-width: 980px) 90vw, 440px"/><span>Direito Penal · Redação · Estratégia</span></div>
      <div className="combat-mentor-copy"><span className="eyebrow">Comando da preparação</span><h2 className="display-title">Método criado por quem conhece <span className="gold">o campo de prova.</span></h2><h3>Everton Mota <small>Mentor CPPEM</small></h3><p>A metodologia transforma experiência em direção prática: um cronograma possível de cumprir, acompanhamento para corrigir desvios e uma equipe que mantém o aluno em movimento até a prova.</p><div className="combat-mentor-points"><span><Medal size={19}/> Estratégia aplicada à rotina</span><span><ShieldCheck size={19}/> Acompanhamento contínuo</span><span><PlayCircle size={19}/> Conteúdo conectado à missão</span></div><a className="gold-button" href="#planos">Quero ser acompanhado <ArrowRight size={17}/></a></div>
    </div></section>

    <section className="combat-proof-section"><div className="container combat-centered-heading"><span className="eyebrow">Prova real</span><h2 className="display-title">Quem executou o plano <span className="gold">chegou mais longe.</span></h2><p>Histórias reais de alunos CPPEM. Sem personagens inventados, apenas os registros de quem viveu essa preparação.</p></div><StudentProof images={approvedStudentImages}/><div className="container combat-stats"><AnimatedStat prefix="+" start={1000} end={14000} label="alunos aprovados"/><AnimatedStat start={1} end={7} suffix="+" label="anos de estrada" duration={1500}/><article className="about-stat"><strong>Caruaru–PE</strong><span>base da nossa missão</span></article></div></section>

    <section className="combat-results-section"><div className="container combat-results-layout"><div><span className="eyebrow">O que muda na prática</span><h2 className="display-title">Menos improviso.<br/><span className="gold">Mais execução.</span></h2></div><div className="combat-results-list">{[
      ["01","Você deixa de montar o estudo do zero","Recebe uma missão diária conectada ao seu cronograma."],
      ["02","Você deixa de medir esforço por horas","Acompanha conclusão, acertos, revisões e constância."],
      ["03","Você deixa de caminhar sem feedback","A equipe identifica desvios e ajuda a ajustar a rota."],
    ].map(([number,title,copy])=><article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>

    <section className="combat-plans-section" id="planos"><div className="container"><div className="combat-centered-heading"><span className="eyebrow">Escolha sua estratégia</span><h2 className="display-title">Três níveis. <span className="gold">Uma missão.</span></h2><p>Entre pelo caminho que combina com a profundidade de acompanhamento que você busca hoje.</p></div><div className="combat-plans-grid">{plans.map((plan)=><article className={`combat-plan-card${plan.featured ? " featured" : ""}`} key={plan.name}>{plan.featured&&<span className="combat-plan-ribbon">Mais escolhido</span>}<small>{plan.eyebrow}</small><h3>Plano {plan.name}</h3><p>{plan.description}</p><ul>{plan.features.map(feature=><li key={feature}><CheckCircle2 size={17}/><span>{feature}</span></li>)}</ul><div className="combat-plan-price"><span>Mensalidade de</span><strong>{plan.monthlyPrice}</strong><small>ou {plan.fullPrice}</small></div><a className={plan.featured?"gold-button":"ghost-button"} href={plan.href} target="_blank" rel="noreferrer">{plan.cta}<ArrowRight size={17}/></a></article>)}</div><p className="combat-plan-note">Os valores e condições exibidos correspondem às ofertas atuais cadastradas no site CPPEM. A confirmação final acontece na página de contratação.</p></div></section>
  </main><SiteFooter/></div>;
}
