"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Notebook e tablet montados em 3D no proprio CSS (perspectiva, dobradica e
 * base deitada em profundidade), com a tela real do cronograma dentro. O mouse
 * gira a cena alguns graus: sem isso a profundidade nao se le em print.
 */
export function CronogramaDevices() {
  const palco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alvo = palco.current;
    if (!alvo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let quadro = 0;
    const mover = (evento: PointerEvent) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const area = alvo.getBoundingClientRect();
        const x = (evento.clientX - area.left) / area.width - 0.5;
        const y = (evento.clientY - area.top) / area.height - 0.5;
        alvo.style.setProperty("--giro-y", `${-18 + x * 16}deg`);
        alvo.style.setProperty("--giro-x", `${6 - y * 8}deg`);
      });
    };
    const soltar = () => {
      cancelAnimationFrame(quadro);
      alvo.style.removeProperty("--giro-y");
      alvo.style.removeProperty("--giro-x");
    };

    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerleave", soltar);
    return () => {
      cancelAnimationFrame(quadro);
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerleave", soltar);
    };
  }, []);

  return <div className="crono-scene" ref={palco}>
    <span className="crono-glow" aria-hidden="true" />

    <div className="crono-stage">
      <div className="crono-laptop">
        <div className="crono-lid">
          <div className="crono-screen">
            <Image src="/images/cronograma.png" alt="Cronograma da semana na plataforma CPPEM: missões concluídas, horas estudadas e plano de ação" width={1919} height={860} sizes="(max-width: 900px) 92vw, 46vw" priority={false} />
            <span className="crono-screen-glare" aria-hidden="true" />
          </div>
          <span className="crono-cam" aria-hidden="true" />
          <span className="crono-brand" aria-hidden="true">CPPEM</span>
        </div>

        <div className="crono-base" aria-hidden="true">
          <span className="crono-hinge" />
          <span className="crono-keys" />
          <span className="crono-trackpad" />
          <span className="crono-rgb" />
        </div>
      </div>

      <div className="crono-tablet" aria-hidden="true">
        <div className="crono-tablet-screen">
          <Image src="/images/cronograma.png" alt="" width={1919} height={860} sizes="18vw" />
        </div>
        <span className="crono-tablet-cam" />
        <span className="crono-tablet-bar" />
      </div>

      <span className="crono-floor" aria-hidden="true" />
    </div>
  </div>;
}
