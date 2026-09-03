/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowDownToLine, BookOpen, Building2, FileText, Search, X } from "lucide-react";
import { DownloadModal } from "@/components/free-content/download-modal";
import type { FreeMaterial, VerticalizedNotice } from "@/types/free-content";

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function ContentCard({ item, notice, onSelect }: { item: FreeMaterial; notice?: VerticalizedNotice; onSelect: (item: FreeMaterial) => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <button className="free-card" type="button" onClick={() => onSelect(item)}>
    <span className="free-card-media">
      {item.imageUrl && !imageFailed ? <img src={item.imageUrl} alt="" onError={() => setImageFailed(true)} /> : notice ? <FileText size={44} /> : <BookOpen size={44} />}
      <span className="free-card-scan" />
      {(notice?.agency || item.label) && <small>{notice?.agency || item.label}</small>}
      {notice?.year && <em>{notice.year}</em>}
    </span>
    <span className="free-card-body">
      <strong>{item.name}</strong>
      {notice && (notice.role || notice.board) && <span className="free-card-tags">{notice.role && <i>{notice.role}</i>}{notice.board && <i>Banca {notice.board}</i>}</span>}
      {item.description && <p>{item.description}</p>}
      <span className="free-card-action"><ArrowDownToLine size={17} /> Liberar download</span>
    </span>
  </button>;
}

export function ContentLibrary({ items, kind, initialSelectedId }: { items: FreeMaterial[] | VerticalizedNotice[]; kind: "materials" | "notices"; initialSelectedId?: string }) {
  const [query, setQuery] = useState("");
  const [agency, setAgency] = useState<string | null>(null);
  const [selected, setSelected] = useState<FreeMaterial | null>(() => items.find((item) => item.id === initialSelectedId) ?? null);
  const close = useCallback(() => setSelected(null), []);
  const agencies = useMemo(() => kind === "notices" ? [...new Set((items as VerticalizedNotice[]).map((item) => item.agency).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")) : [], [items, kind]);
  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return items.filter((item) => {
      const notice = item as VerticalizedNotice;
      return (!agency || notice.agency === agency) && (!term || normalize(`${item.name} ${item.label} ${item.description} ${notice.agency ?? ""} ${notice.role ?? ""} ${notice.board ?? ""}`).includes(term));
    });
  }, [items, query, agency]);

  return <div className="free-library">
    <div className="free-toolbar">
      <label><Search size={18} /><span className="sr-only">Buscar</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={kind === "notices" ? "Buscar concurso, cargo ou banca" : "Buscar material ou assunto"} />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={16} /></button>}</label>
      <span>{String(filtered.length).padStart(2, "0")} {filtered.length === 1 ? "resultado" : "resultados"}</span>
    </div>
    {agencies.length > 1 && <div className="free-filters" role="group" aria-label="Filtrar por órgão"><button type="button" data-active={!agency} onClick={() => setAgency(null)}>Todos</button>{agencies.map((name) => <button type="button" data-active={agency === name} onClick={() => setAgency(agency === name ? null : name)} key={name}><Building2 size={14} />{name}</button>)}</div>}
    {filtered.length ? <div className="free-grid">{filtered.map((item) => <ContentCard item={item} notice={kind === "notices" ? item as VerticalizedNotice : undefined} onSelect={setSelected} key={item.id} />)}</div> : <div className="free-empty"><span>00</span><strong>Nenhum conteúdo encontrado.</strong><p>Limpe a busca ou altere os filtros para visualizar toda a biblioteca.</p><button className="ghost-button" type="button" onClick={() => { setQuery(""); setAgency(null); }}>Limpar filtros</button></div>}
    <DownloadModal key={selected?.id ?? "closed"} item={selected} onClose={close} source={kind === "notices" ? "edital_verticalizado" : "material_gratuito"} />
  </div>;
}
