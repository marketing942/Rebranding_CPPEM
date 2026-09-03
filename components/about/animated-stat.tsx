"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  end: number;
  label: string;
  prefix?: string;
  start: number;
  suffix?: string;
  duration?: number;
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function AnimatedStat({
  end,
  label,
  prefix = "",
  start,
  suffix = "",
  duration = 1800,
}: AnimatedStatProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }

    let animationFrame = 0;
    let hasStarted = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return;

        hasStarted = true;
        observer.disconnect();
        const startedAt = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;

          setValue(Math.round(start + (end - start) * easedProgress));

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animationFrame = requestAnimationFrame(animate);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, end, start]);

  return (
    <article
      ref={elementRef}
      className="about-stat"
      aria-label={`${prefix}${numberFormatter.format(end)}${suffix} ${label}`}
    >
      <strong aria-hidden="true">
        {prefix}{numberFormatter.format(value)}{suffix}
      </strong>
      <span aria-hidden="true">{label}</span>
    </article>
  );
}
