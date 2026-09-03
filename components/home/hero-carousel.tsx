"use client";

import Link from "next/link";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { CampaignBanner } from "@/types/content";

export function HeroCarousel({ banners }: { banners: CampaignBanner[] }) {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  useEffect(() => {
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % banners.length), 7000);
    return () => window.clearInterval(id);
  }, [banners.length]);
  const banner = banners[active];
  if (!banner) return null;
  const resizeToArtwork = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (!image.naturalWidth || !image.naturalHeight) return;
    const ratio = image.naturalWidth / image.naturalHeight;
    setRatios((current) => current[banner.id] === ratio ? current : { ...current, [banner.id]: ratio });
  };
  return <section className="hero-wrap"><div className="container"><div className="hero-banner-shell">
    <Link className="hero-banner" style={ratios[banner.id] ? { aspectRatio: String(ratios[banner.id]) } : undefined} data-overlay={Boolean(banner.callout || banner.ctaLabel)} href={banner.href} aria-label={`${banner.name}: acessar campanha`}>
      <picture>{banner.mobileUrl && <source media="(max-width: 800px)" srcSet={banner.mobileUrl}/>}<img className="hero-image" src={banner.desktopUrl} alt={banner.name} onLoad={resizeToArtwork}/></picture>
      {(banner.callout || banner.ctaLabel) && <div className="hero-campaign-content">{banner.callout && <strong>{banner.callout}</strong>}{banner.ctaLabel && <span className="gold-button">{banner.ctaLabel}</span>}</div>}
    </Link>
    {banners.length > 1 && <div className="hero-dots" aria-label="Selecionar campanha">{banners.map((item,index) => <button type="button" className="hero-dot" data-active={index === active} aria-label={`Mostrar campanha ${index + 1}`} onClick={() => setActive(index)} key={item.id}/>)}</div>}
  </div></div></section>;
}
