"use client";

import Image from "next/image";
import {
  BarChart3,
  BrainCircuit,
  CalendarCheck2,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  Crosshair,
  Flame,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    eyebrow: "01 · Plano de execução",
    title: "Cronograma que transforma intenção em missão.",
    copy: "O método MDT organiza mentalidade, disciplina e técnica em uma semana possível de cumprir. A plataforma mostra o que fazer e como corrigir a rota.",
    image: "/images/cronograma.png",
    alt: "Cronograma CPPEM com missão da semana, horas estudadas, feedback e plano de ação",
    callouts: [
      { className: "story-card-top-left", icon: BrainCircuit, tag: "MDT · 01", title: "Mentalidade", copy: "Clareza para continuar quando a motivação oscila." },
      { className: "story-card-bottom-left", icon: ShieldCheck, tag: "MDT · 02", title: "Disciplina", copy: "Metas possíveis convertidas em constância semanal." },
      { className: "story-card-top-right", icon: Crosshair, tag: "MDT · 03", title: "Técnica", copy: "Conteúdo, questões e revisão na ordem correta." },
      { className: "story-card-bottom-right", icon: CalendarCheck2, tag: "Rota individual", title: "Cronograma personalizado", copy: "Planejamento compatível com sua prova e sua rotina." },
    ],
  },
  {
    eyebrow: "02 · Rendimento operacional",
    title: "O que não é medido não pode ser melhorado.",
    copy: "A segunda camada acompanha o que você concluiu, quanto estudou, onde acerta e em quais matérias precisa concentrar o próximo esforço.",
    image: "/images/rendimento.png",
    alt: "Painel de rendimento operacional CPPEM com progresso do edital, horas estudadas, acertos e simulados",
    callouts: [
      { className: "story-card-top-left", icon: Gauge, tag: "Cobertura do edital", title: "Progresso real", copy: "Visualize assuntos concluídos sem depender de percepção." },
      { className: "story-card-bottom-left", icon: Clock3, tag: "Tempo de execução", title: "Horas estudadas", copy: "Hoje, semana, mês e total reunidos no mesmo painel." },
      { className: "story-card-top-right", icon: BarChart3, tag: "Precisão", title: "Acertos e erros", copy: "Descubra onde o desempenho está avançando ou travando." },
      { className: "story-card-middle-right", icon: ChartNoAxesCombined, tag: "Leitura por disciplina", title: "Rendimento por matéria", copy: "Prioridades recalculadas com base no seu resultado." },
      { className: "story-card-bottom-right", icon: Flame, tag: "Ritmo operacional", title: "Sequência e simulados", copy: "Constância e histórico para manter a preparação ativa." },
    ],
  },
] as const;

export function CombatPlatformStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = storyRef.current;
    if (!root) return;

    const markers = Array.from(root.querySelectorAll<HTMLElement>("[data-story-marker]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStep(Number((visible.target as HTMLElement).dataset.storyMarker ?? 0));
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, []);

  return <div className="combat-story" ref={storyRef}>
    <div className="combat-story-sticky">
      <div className="combat-story-copy" aria-live="polite">
        <span>{steps[activeStep].eyebrow}</span>
        <h3>{steps[activeStep].title}</h3>
        <p>{steps[activeStep].copy}</p>
        <div className="combat-story-progress" aria-label={`Etapa ${activeStep + 1} de ${steps.length}`}>
          {steps.map((step, index) => <button type="button" className={index === activeStep ? "active" : ""} onClick={() => setActiveStep(index)} aria-label={`Mostrar ${step.eyebrow}`} key={step.eyebrow}><i/><small>0{index + 1}</small></button>)}
        </div>
      </div>

      <div className="combat-story-visual">
        <span className="combat-platform-glow" aria-hidden="true" />
        {steps.map((step, index) => <div className={`combat-story-panel${index === activeStep ? " active" : ""}`} aria-hidden={index !== activeStep} key={step.image}>
          <div className="combat-platform-screen">
            <div className="combat-platform-bar" aria-hidden="true"><i/><i/><i/><strong>Plataforma CPPEM · {index === 0 ? "Missão da semana" : "Rendimento operacional"}</strong></div>
            <Image src={step.image} alt={step.alt} width={1919} height={860} sizes="(max-width: 980px) 100vw, 900px" priority={index === 0}/>
          </div>
          {step.callouts.map(({className,icon:Icon,tag,title,copy}) => <article className={`combat-platform-card ${className}`} key={title}><span><Icon size={18}/></span><div><small>{tag}</small><strong>{title}</strong><p>{copy}</p></div></article>)}
        </div>)}
      </div>
    </div>
    <div className="combat-story-markers" aria-hidden="true">
      <span data-story-marker="0"><CheckCircle2 size={16}/> Plano individual</span>
      <span data-story-marker="1"><ChartNoAxesCombined size={16}/> Rendimento operacional</span>
    </div>
  </div>;
}
