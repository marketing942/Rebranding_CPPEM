"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function CronogramaDevices() {
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = palco.current;
    if (!alvo) return;

    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        alvo.classList.add("is-visible");
        observador.disconnect();
      }
    }, { threshold: 0.22 });

    observador.observe(alvo);

    if (reduzirMovimento || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => observador.disconnect();
    }

    let quadro = 0;
    const mover = (evento: PointerEvent) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const area = alvo.getBoundingClientRect();
        const x = (evento.clientX - area.left) / area.width - 0.5;
        const y = (evento.clientY - area.top) / area.height - 0.5;
        alvo.style.setProperty("--giro-y", `${x * 7}deg`);
        alvo.style.setProperty("--giro-x", `${-y * 5}deg`);
        alvo.style.setProperty("--luz-x", `${50 + x * 18}%`);
        alvo.style.setProperty("--luz-y", `${45 + y * 15}%`);
      });
    };
    const soltar = () => {
      cancelAnimationFrame(quadro);
      alvo.style.removeProperty("--giro-y");
      alvo.style.removeProperty("--giro-x");
      alvo.style.removeProperty("--luz-x");
      alvo.style.removeProperty("--luz-y");
    };

    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerleave", soltar);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerleave", soltar);
    };
  }, []);

  return <div className="crono-scene" ref={palco}>
    <span className="crono-glow" aria-hidden="true" />

    <div className="crono-stage">
      <div className="crono-ipad">
        <Image
          className="crono-ipad-frame"
          src="/images/cronograma-ipad-3d.png"
          alt="iPad exibindo o cronograma semanal personalizado do CPPEM"
          width={1536}
          height={1024}
          sizes="(max-width: 900px) 92vw, 48vw"
        />
        <div className="crono-ipad-display">
          <Image
            src="/images/cronograma-ipad-screen-v2.png"
            alt="Cronograma CPPEM com missões, horas estudadas, feedback e plano de ação"
            fill
            sizes="(max-width: 900px) 78vw, 39vw"
          />
          <span className="crono-glass-reflection" aria-hidden="true" />
        </div>
      </div>

      <div className="crono-phone">
        <Image
          className="crono-phone-frame"
          src="/images/cronograma-phone-3d.png"
          alt="Smartphone exibindo o ajuste de horas do Plano de Combate CPPEM"
          width={1024}
          height={1536}
          sizes="(max-width: 900px) 34vw, 17vw"
        />
        <div className="crono-phone-display">
          <Image
            src="/images/plano-combate-mobile-v2.jpeg"
            alt="Tela do Plano de Combate com a distribuição de horas de estudo por dia"
            fill
            sizes="(max-width: 900px) 26vw, 13vw"
          />
          <span className="crono-glass-reflection" aria-hidden="true" />
        </div>
        <span className="crono-dynamic-island" aria-hidden="true" />
      </div>

      <span className="crono-chip crono-chip-hours" aria-hidden="true"><small>PLANO SEMANAL</small><strong>22H</strong></span>
      <span className="crono-chip crono-chip-status" aria-hidden="true"><i /> ROTA ATIVA</span>
      <span className="crono-floor" aria-hidden="true" />
    </div>
  </div>;
}
