import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CalendarCheck2, Crosshair, MapPin, ShieldCheck, Star, Users } from "lucide-react";

// busca pelo nome, que cai na ficha do CPPEM no Maps; trocar pelo link curto do
// perfil quando ele estiver em mãos
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=CPPEM+Caruaru+PE";

const mdtPillars = [
  { icon: BrainCircuit, tag: "MDT · 01", title: "Mentalidade", copy: "Antes do conteúdo vem a cabeça no lugar. Você entende o tamanho da disputa, aprende a lidar com a oscilação da motivação e passa a decidir pelo plano, não pelo humor do dia." },
  { icon: ShieldCheck, tag: "MDT · 02", title: "Disciplina", copy: "Meta possível vira constância. O cronograma cobra o que cabe na sua semana real, e a plataforma registra o que foi cumprido para o esforço não depender de memória nem de promessa." },
  { icon: Crosshair, tag: "MDT · 03", title: "Técnica", copy: "Conteúdo, questão e revisão na ordem certa, do jeito que a banca cobra. Aula para aprender, questão para fixar e revisão programada para não perder o que já foi conquistado." },
] as const;

export function AboutHowItWorks() {
  return <section className="about-how-section">
    <div className="container about-how-heading">
      <span className="eyebrow">Como funciona o CPPEM</span>
      <h2 className="display-title">Três forças trabalhando juntas pela sua <span className="gold">aprovação.</span></h2>
      <p className="section-copy">Estrutura, rota e método. Cada uma resolve um problema diferente da preparação — e é a soma das três que separa estudar muito de estudar certo.</p>
    </div>

    <div className="container about-how-rows">
      <article className="about-how-row" data-side="right">
        <div className="about-how-copy">
          <span className="about-how-step">01 · A casa</span>
          <h3>A estrutura que já formou <span className="gold">mais de 14 mil aprovados.</span></h3>
          <p>Sete anos de estrada preparando candidato para carreira policial, com unidade presencial em Caruaru e a plataforma aberta para quem estuda de qualquer cidade. O mesmo método, a mesma cobrança e o mesmo acompanhamento nos dois formatos.</p>
          <ul className="about-how-list">
            <li><Users size={16} /> Turmas presenciais e preparação a distância</li>
            <li><MapPin size={16} /> Unidade própria em Caruaru–PE</li>
            <li><CalendarCheck2 size={16} /> Plataforma no computador e no celular</li>
          </ul>
          <Link className="ghost-button" href="/presencial">Conhecer o presencial <ArrowRight size={16} /></Link>
        </div>
        <div className="about-how-visual">
          <div className="about-how-devices about-how-devices-render">
            <span className="about-devices-halo" aria-hidden="true" />
            <Image
              className="about-devices-product"
              src="/images/platform-devices-v2.png"
              alt="Plataforma CPPEM aberta em um notebook de alumínio e em um smartphone"
              width={1536}
              height={1024}
              sizes="(max-width: 900px) 100vw, 56vw"
            />
            <span className="about-devices-ground" aria-hidden="true" />
          </div>
          <a className="about-how-rating" href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver as avaliações do CPPEM no Google Maps">
            <strong>4,9</strong>
            <span className="about-how-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={13} fill="currentColor" />)}</span>
            <small>no Google · ver avaliações</small>
          </a>
        </div>
      </article>

      <article className="about-how-row about-how-row-reverse" data-side="left">
        <div className="about-how-copy">
          <span className="about-how-step">02 · A rota</span>
          <h3>Um cronograma montado para a <span className="gold">sua semana.</span></h3>
          <p>Nada de plano genérico. O cronograma é construído a partir do seu concurso, do tempo que você tem e do ponto em que está hoje — e se reorganiza quando a vida atrapalha, em vez de deixar você acumulando atraso.</p>
          <ul className="about-how-list">
            <li><CalendarCheck2 size={16} /> Missão do dia definida, sem decidir por onde começar</li>
            <li><Crosshair size={16} /> Revisão e simulado no calendário, não no improviso</li>
            <li><Users size={16} /> Mentoria individual para corrigir a rota junto com você</li>
          </ul>
          <Link className="ghost-button" href="/plano-de-combate">Ver o Plano de Combate <ArrowRight size={16} /></Link>
        </div>
        <div className="about-how-visual">
          <div className="about-how-window">
            <div className="about-platform-bar" aria-hidden="true"><span /><span /><span /><strong>Cronograma da semana</strong></div>
            <Image src="/images/cronograma.png" alt="Cronograma CPPEM com a missão da semana, horas estudadas e plano de ação" width={1280} height={720} />
          </div>
        </div>
      </article>

      <article className="about-how-row about-how-row-method" data-side="right">
        <div className="about-how-copy">
          <span className="about-how-step">03 · O método</span>
          <h3>Método <span className="gold">MDT:</span> mentalidade, disciplina e técnica.</h3>
          <p>O MDT é a forma como o CPPEM ensina. Ele parte de uma constatação simples: quem não passa raramente parou por falta de conteúdo — parou por falta de cabeça, de constância ou de direção. As três frentes são trabalhadas na mesma semana, e não uma depois da outra.</p>
          <p>Na prática, cada pilar tem entrega própria dentro da plataforma, e o painel de desempenho mostra qual deles está travando a sua evolução.</p>
        </div>
        <div className="about-how-visual">
          <div className="about-mdt-stack">
            {mdtPillars.map(({ icon: Icon, tag, title, copy }) => <article className="about-mdt-card" key={tag}>
              <span className="about-mdt-icon"><Icon size={19} /></span>
              <div><small>{tag}</small><h4>{title}</h4><p>{copy}</p></div>
            </article>)}
          </div>
        </div>
      </article>
    </div>
  </section>;
}
