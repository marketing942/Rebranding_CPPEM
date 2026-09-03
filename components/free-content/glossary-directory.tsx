"use client";

import { useMemo, useState } from "react";
import { Quote, Search, X } from "lucide-react";
import type { GlossaryEntry, GlossarySection } from "@/lib/glossary-content";

function normalize(value: string) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }

export function GlossaryDirectory({ sections, expressions }: { sections: readonly GlossarySection[]; expressions: readonly GlossaryEntry[] }) {
  const [query, setQuery] = useState("");
  const term = normalize(query.trim());
  const filteredSections = useMemo(() => sections.map((section) => ({ ...section, entries: term ? section.entries.filter((entry) => normalize(`${entry.term} ${entry.definition}`).includes(term)) : section.entries })).filter((section) => section.entries.length), [sections, term]);
  const filteredExpressions = useMemo(() => term ? expressions.filter((entry) => normalize(`${entry.term} ${entry.definition}`).includes(term)) : expressions, [expressions, term]);
  const total = filteredSections.reduce((sum, section) => sum + section.entries.length, 0) + filteredExpressions.length;
  const available = new Set(filteredSections.map((section) => section.letter));
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });

  return <div className="glossary-directory">
    <div className="glossary-toolbar">
      <label><Search size={18} /><span className="sr-only">Buscar termo</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar termo ou definição" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={16} /></button>}</label>
      <span>{total} {total === 1 ? "verbete" : "verbetes"}</span>
      <nav aria-label="Índice alfabético">{sections.map((section) => <button type="button" disabled={!available.has(section.letter)} onClick={() => jump(`letra-${section.letter}`)} key={section.letter}>{section.letter}</button>)}</nav>
    </div>
    {!total && <div className="free-empty"><span>00</span><strong>Nenhum verbete encontrado.</strong><p>Tente outra expressão ou limpe a busca.</p></div>}
    {filteredSections.map((section) => <section className="glossary-letter-section" id={`letra-${section.letter}`} key={section.letter}><header><strong>{section.letter}</strong><span>{String(section.entries.length).padStart(2, "0")}</span></header><dl>{section.entries.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl></section>)}
    {filteredExpressions.length > 0 && <section className="glossary-letter-section" id="expressoes"><header><strong className="glossary-expressions"><Quote size={25} /> Expressões CPPEM</strong><span>{String(filteredExpressions.length).padStart(2, "0")}</span></header><dl>{filteredExpressions.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl></section>}
  </div>;
}
