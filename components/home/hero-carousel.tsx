"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CampaignBanner } from "@/types/content";

const MOBILE_QUERY = "(max-width: 800px)";

// uma proporção só para todo o carrossel: a mais frequente entre as artes. Assim
// a moldura não muda de altura a cada troca, e arte fora do padrão aparece
// inteira, com uma tarja fina, em vez de ser cortada.
function commonRatio(values: number[]) {
  if (!values.length) return null;
  const tally = new Map<number, number>();
  for (const value of values) {
    const key = Math.round(value * 100) / 100;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
}

export function HeroCarousel({ banners }: { banners: CampaignBanner[] }) {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});

  // o contador reinicia a cada troca, inclusive nas manuais: quem clicou na seta
  // ganha os 7s inteiros para ver a campanha antes de o carrossel seguir
  useEffect(() => {
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % banners.length), 7000);
    return () => window.clearInterval(id);
  }, [banners.length, active]);

  const go = (step: number) => setActive((value) => (value + step + banners.length) % banners.length);

  // as artes são medidas fora da tela: no onLoad da imagem exibida a medida se
  // perdia quando o arquivo vinha do cache e carregava antes da hidratação, e a
  // moldura ficava presa na proporção padrão do CSS
  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY);
    let alive = true;
    const measure = () => {
      setRatios({});
      for (const banner of banners) {
        const image = new window.Image();
        image.onload = () => {
          if (!alive || !image.naturalWidth || !image.naturalHeight) return;
          setRatios((current) => ({ ...current, [banner.id]: image.naturalWidth / image.naturalHeight }));
        };
        image.src = mobile.matches && banner.mobileUrl ? banner.mobileUrl : banner.desktopUrl;
      }
    };
    measure();
    mobile.addEventListener("change", measure);
    return () => { alive = false; mobile.removeEventListener("change", measure); };
  }, [banners]);

  const ratio = useMemo(() => commonRatio(Object.values(ratios)), [ratios]);
  const banner = banners[active];
  if (!banner) return null;

  return <section className="hero-wrap"><div className="container"><div className="hero-banner-shell">
    <span className="hero-glow" aria-hidden="true"><i /><i /><i /><i /></span>
    <Link className="hero-banner" style={ratio ? { aspectRatio: String(ratio) } : undefined} data-overlay={Boolean(banner.callout || banner.ctaLabel)} href={banner.href} aria-label={`${banner.name}: acessar campanha`}>
      <picture>{banner.mobileUrl && <source media={MOBILE_QUERY} srcSet={banner.mobileUrl}/>}<img className="hero-image" src={banner.desktopUrl} alt={banner.name}/></picture>
      {(banner.callout || banner.ctaLabel) && <div className="hero-campaign-content">{banner.callout && <strong>{banner.callout}</strong>}{banner.ctaLabel && <span className="gold-button">{banner.ctaLabel}</span>}</div>}
    </Link>
    {banners.length > 1 && <>
      <button type="button" className="hero-arrow hero-arrow-prev" onClick={() => go(-1)} aria-label="Campanha anterior"><ChevronLeft size={22} /></button>
      <button type="button" className="hero-arrow hero-arrow-next" onClick={() => go(1)} aria-label="Próxima campanha"><ChevronRight size={22} /></button>
      <div className="hero-dots" aria-label="Selecionar campanha">{banners.map((item,index) => <button type="button" className="hero-dot" data-active={index === active} aria-label={`Mostrar campanha ${index + 1}`} onClick={() => setActive(index)} key={item.id}/>)}</div>
    </>}
  </div></div></section>;
}
