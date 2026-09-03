/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, type FocusEvent } from "react";
import { ArrowUpRight, BadgePercent, Camera, MessageCircle, Search } from "lucide-react";
import { normalizePartnerKey, partnerInitials, type Partner, type PartnerCategory } from "@/lib/partners";

export function PartnerDirectory({ partners, categories }: { partners: Partner[]; categories: PartnerCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [activeId, setActiveId] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const known = new Set(categories.map((item) => item.key));
    const extras = partners
      .filter((partner) => partner.categoryKey && !known.has(partner.categoryKey))
      .map((partner) => ({ key: partner.categoryKey, label: partner.categoryLabel }));
    return [{ key: "todos", label: "Todos" }, ...categories, ...extras.filter((item, index, list) => list.findIndex((candidate) => candidate.key === item.key) === index)];
  }, [categories, partners]);

  const filtered = useMemo(() => {
    const term = normalizePartnerKey(query);
    return partners.filter((partner) => {
      if (category !== "todos" && partner.categoryKey !== category) return false;
      if (!term) return true;
      return normalizePartnerKey(`${partner.name} ${partner.categoryLabel} ${partner.description} ${partner.benefit}`).includes(term);
    });
  }, [partners, query, category]);

  function leaveCard(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActiveId(null);
  }

  return <div className="partner-directory">
    <div className="partner-directory-toolbar">
      <label className="partner-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar parceiro</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por parceiro ou benefício" /></label>
      <span className="partner-result-count">{String(filtered.length).padStart(2, "0")} de {String(partners.length).padStart(2, "0")} parceiros</span>
    </div>

    <div className="partner-filter-tabs" role="group" aria-label="Filtrar parceiros por categoria">
      {tabs.map((tab) => <button type="button" key={tab.key} aria-pressed={category === tab.key} onClick={() => { setCategory(tab.key); setActiveId(null); }}>{tab.label}</button>)}
    </div>

    {filtered.length > 0 ? <div className="partner-grid" onMouseLeave={() => setActiveId(null)}>
      {filtered.map((partner, index) => {
        const open = activeId === partner.id;
        const dimmed = Boolean(activeId && !open);
        return <article
          className="partner-card"
          data-open={open}
          data-dimmed={dimmed}
          key={partner.id}
          onMouseEnter={() => setActiveId(partner.id)}
          onFocusCapture={() => setActiveId(partner.id)}
          onBlur={leaveCard}
        >
          <button className="partner-card-summary" type="button" aria-expanded={open} aria-controls={`partner-benefit-${index}`} onClick={() => setActiveId(open ? null : partner.id)}>
            <span className="partner-logo">{partner.logoUrl ? <img src={partner.logoUrl} alt="" loading="lazy" /> : partnerInitials(partner.name)}</span>
            <span className="partner-identity"><span>{partner.categoryLabel}</span><strong>{partner.name}</strong>{partner.featured && <small>Destaque CPPEM</small>}</span>
            <ArrowUpRight className="partner-card-arrow" size={20} aria-hidden="true" />
          </button>
          <p className="partner-description">{partner.description}</p>
          <div className="partner-benefit" id={`partner-benefit-${index}`} aria-hidden={!open}>
            <div className="partner-benefit-heading"><BadgePercent size={18} aria-hidden="true" /><span>Benefício CPPEM</span></div>
            <p>{partner.benefit || "Consulte as condições diretamente com o parceiro."}</p>
            <div className="partner-actions">
              {partner.whatsappUrl && <a href={partner.whatsappUrl} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}><MessageCircle size={16} />WhatsApp</a>}
              {partner.instagramUrl && <a href={partner.instagramUrl} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}><Camera size={16} />Instagram</a>}
            </div>
          </div>
        </article>;
      })}
    </div> : <div className="partner-empty"><strong>Nenhum parceiro encontrado.</strong><span>Ajuste a busca ou selecione outra categoria.</span></div>}
  </div>;
}
