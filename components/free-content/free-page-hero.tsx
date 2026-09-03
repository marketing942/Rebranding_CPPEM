import type { LucideIcon } from "lucide-react";

export function FreePageHero({ icon: Icon, eyebrow, title, accent, description, count }: { icon: LucideIcon; eyebrow: string; title: string; accent: string; description: string; count?: number }) {
  return <section className="free-hero"><div className="free-hero-grid" aria-hidden="true" /><div className="free-hero-orbit" aria-hidden="true"><span /><span /><span /></div><div className="container free-hero-inner">
    <span className="eyebrow"><Icon size={16} /> {eyebrow}</span>
    <h1>{title}<span>{accent}</span></h1>
    <p>{description}</p>
    {typeof count === "number" && <div className="free-hero-count"><strong>{String(count).padStart(2, "0")}</strong><span>conteúdos<br />disponíveis</span></div>}
  </div></section>;
}
