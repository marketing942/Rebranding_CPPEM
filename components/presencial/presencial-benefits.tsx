"use client";

import Image from "next/image";
import { CalendarDays, ClipboardCheck, Compass, FileText, GraduationCap, ListChecks, Mic, Presentation, Radio, ShieldCheck, University, Users, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Benefit = { icon: LucideIcon; title: string; description: string };

const benefits: Benefit[] = [
  { icon: Presentation, title: "Aulas presenciais", description: "Professor na sua frente, turma ao lado e o compromisso de estar na sala." },
  { icon: CalendarDays, title: "Cronograma da turma", description: "Cada semana com assunto definido — você chega sabendo o que vai estudar." },
  { icon: FileText, title: "Material de apoio da aula", description: "Conteúdo entregue junto com a aula, sem precisar caçar PDF na internet." },
  { icon: Radio, title: "Aulas ao vivo e gravadas", description: "As aulas são transmitidas ao vivo e permanecem disponíveis na plataforma." },
  { icon: ListChecks, title: "Planejamento desde o início", description: "O curso organizado desde o primeiro dia para você manter o ritmo." },
  { icon: Users, title: "Grupo VIP de alunos", description: "Convivência diária com pessoas que avançam na mesma missão que você." },
  { icon: ShieldCheck, title: "Monitores e xerifes", description: "Apoio de perto para destravar dúvidas e cobrar constância." },
  { icon: GraduationCap, title: "Professores especialistas", description: "Equipe especialista em concursos, formada também por servidores públicos." },
  { icon: University, title: "Estrutura em Caruaru", description: "Salas amplas e climatizadas, preparadas para sua rotina de estudos." },
  { icon: ClipboardCheck, title: "Simulados presenciais", description: "Treino no clima da prova real, com tempo e pressão de verdade." },
  { icon: Compass, title: "Métodos EXCLUSIVOS", description: "Estratégias para estudar certo e evoluir com mais clareza." },
  { icon: Mic, title: "Palestras com convidados", description: "Encontros com quem já percorreu o caminho e conhece a carreira." },
];

function BenefitCard({ benefit, index, side }: { benefit: Benefit; index: number; side: "left" | "right" }) {
  const Icon = benefit.icon;
  return <article className="presencial-benefit-card" data-side={side} style={{ "--benefit-delay": `${index * 80}ms` } as React.CSSProperties}>
    <span className="presencial-benefit-icon"><Icon size={20} aria-hidden="true" /></span>
    <div><h3>{benefit.title}</h3><p>{benefit.description}</p></div>
  </article>;
}

export function PresencialBenefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: .12, rootMargin: "0px 0px -12% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const left = benefits.slice(0, 6);
  const right = benefits.slice(6);

  return <div className="presencial-benefits-layout" data-visible={visible} ref={sectionRef}>
    <div className="presencial-benefits-column">{left.map((benefit, index) => <BenefitCard benefit={benefit} index={index} side="left" key={benefit.title} />)}</div>
    <div className="presencial-benefits-core" aria-hidden="true">
      <span className="presencial-benefits-orbit orbit-a" /><span className="presencial-benefits-orbit orbit-b" />
      <span className="presencial-benefits-lion"><Image src="/brand/emblema-leao.webp" alt="" width={112} height={112} /></span>
      <small>Sua vaga</small>
    </div>
    <div className="presencial-benefits-column">{right.map((benefit, index) => <BenefitCard benefit={benefit} index={index} side="right" key={benefit.title} />)}</div>
  </div>;
}
