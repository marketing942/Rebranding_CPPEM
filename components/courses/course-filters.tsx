"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { CourseProduct } from "@/types/content";

export type Filtros = { tipo: string | null; faixa: string | null; ordem: string; pagina: number };

export const POR_PAGINA = 24;

// grupos na ordem em que o aluno decide: primeiro a preparação, depois o apoio
export const GRUPOS: Array<{ grupo: string; tipos: string[] }> = [
  { grupo: "Preparação", tipos: ["Curso online", "Curso unificado", "Curso isolado", "Preparação presencial", "Plano de Combate"] },
  { grupo: "Material de estudo", tipos: ["Resumo bizurado", "Caderno de questões", "Vade mecum", "E-book e ferramentas"] },
  { grupo: "Leve tudo", tipos: ["Combo"] },
  { grupo: "Outros", tipos: ["Vestuário e acessórios", "Evento", "Outros"] },
];

export const FAIXAS: Array<{ rotulo: string; teste: (valor: number) => boolean }> = [
  { rotulo: "Até R$ 49", teste: (v) => v <= 49.99 },
  { rotulo: "R$ 50 a R$ 99", teste: (v) => v >= 50 && v <= 99.99 },
  { rotulo: "R$ 100 a R$ 199", teste: (v) => v >= 100 && v <= 199.99 },
  { rotulo: "R$ 200 a R$ 499", teste: (v) => v >= 200 && v <= 499.99 },
  { rotulo: "R$ 500 ou mais", teste: (v) => v >= 500 },
];

export function valorDe(preco: string) {
  const numero = Number(preco.replace(/[^\d,]/g, "").replace(",", "."));
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

// "relevância" é a ordem em que o aluno decide: preparação primeiro, depois o
// que complementa. Sem isso o catálogo abre com vade mecum e camiseta.
const PESO = ["Curso online", "Curso unificado", "Preparação presencial", "Plano de Combate", "Combo",
  "Resumo bizurado", "Caderno de questões", "Vade mecum", "Curso isolado", "E-book e ferramentas",
  "Vestuário e acessórios", "Evento", "Outros"];

export function aplicar(produtos: CourseProduct[], filtros: Filtros) {
  let lista = produtos;
  if (filtros.tipo) lista = lista.filter((p) => p.type === filtros.tipo);
  if (filtros.faixa) {
    const faixa = FAIXAS.find((f) => f.rotulo === filtros.faixa);
    lista = lista.filter((p) => { const v = valorDe(p.price); return v !== null && faixa!.teste(v); });
  }
  const ordenacoes: Record<string, (a: CourseProduct, b: CourseProduct) => number> = {
    menor: (a, b) => (valorDe(a.price) ?? Infinity) - (valorDe(b.price) ?? Infinity),
    maior: (a, b) => (valorDe(b.price) ?? 0) - (valorDe(a.price) ?? 0),
  };
  if (ordenacoes[filtros.ordem]) return [...lista].sort(ordenacoes[filtros.ordem]);
  const posicao = (p: CourseProduct) => { const i = PESO.indexOf(p.type); return i === -1 ? PESO.length : i; };
  return [...lista].sort((a, b) => posicao(a) - posicao(b)
    || (valorDe(b.price) ?? 0) - (valorDe(a.price) ?? 0)
    || a.name.localeCompare(b.name, "pt-BR"));
}

export function CourseFilters({ produtos, filtros, aoMudar }: {
  produtos: CourseProduct[];
  filtros: Filtros;
  aoMudar: (filtros: Filtros) => void;
}) {
  const total = aplicar(produtos, filtros).length;
  const conta = (teste: (p: CourseProduct) => boolean) => produtos.filter(teste).length;
  const alterna = (campo: "tipo" | "faixa", valor: string) =>
    aoMudar({ ...filtros, [campo]: filtros[campo] === valor ? null : valor, pagina: 1 });

  return <div className="course-filters">
    <div className="course-filters-head">
      <span className="course-filters-title"><SlidersHorizontal size={15} aria-hidden="true" /> Filtrar catálogo</span>
      <span className="course-filters-count"><b>{total}</b> item(ns)</span>
      <label className="course-filters-order">
        Ordenar
        <select value={filtros.ordem} onChange={(evento) => aoMudar({ ...filtros, ordem: evento.target.value, pagina: 1 })}>
          <option value="rel">Relevância</option>
          <option value="menor">Menor preço</option>
          <option value="maior">Maior preço</option>
        </select>
      </label>
    </div>

    <div className="course-filters-groups">
      {GRUPOS.map(({ grupo, tipos }) => {
        const disponiveis = tipos.filter((tipo) => conta((p) => p.type === tipo) > 0);
        if (!disponiveis.length) return null;
        return <div className="course-filters-group" key={grupo}>
          <small>{grupo}</small>
          <div>{disponiveis.map((tipo) => <button type="button" key={tipo} aria-pressed={filtros.tipo === tipo} onClick={() => alterna("tipo", tipo)}>
            {tipo}<em>{conta((p) => p.type === tipo)}</em>
          </button>)}</div>
        </div>;
      })}
      <div className="course-filters-group">
        <small>Preço</small>
        <div>{FAIXAS.map(({ rotulo, teste }) => {
          const quantos = conta((p) => { const v = valorDe(p.price); return v !== null && teste(v); });
          if (!quantos) return null;
          return <button type="button" key={rotulo} aria-pressed={filtros.faixa === rotulo} onClick={() => alterna("faixa", rotulo)}>
            {rotulo}<em>{quantos}</em>
          </button>;
        })}</div>
      </div>
    </div>

    {(filtros.tipo || filtros.faixa) && <button className="course-filters-clear" type="button"
      onClick={() => aoMudar({ ...filtros, tipo: null, faixa: null, pagina: 1 })}>
      <X size={13} aria-hidden="true" /> Limpar filtros
    </button>}
  </div>;
}

export function CoursePagination({ total, pagina, aoIr }: { total: number; pagina: number; aoIr: (pagina: number) => void }) {
  const paginas = Math.ceil(total / POR_PAGINA);
  if (paginas <= 1) return null;
  const numeros: Array<number | "…"> = [];
  for (let p = 1; p <= paginas; p += 1) {
    if (p === 1 || p === paginas || Math.abs(p - pagina) <= 1) numeros.push(p);
    else if (numeros.at(-1) !== "…") numeros.push("…");
  }
  return <nav className="course-pagination" aria-label="Páginas do catálogo">
    <button type="button" onClick={() => aoIr(pagina - 1)} disabled={pagina === 1} aria-label="Página anterior">«</button>
    {numeros.map((p, indice) => p === "…"
      ? <button type="button" key={`corte-${indice}`} disabled>…</button>
      : <button type="button" key={p} aria-current={p === pagina} onClick={() => aoIr(p)}>{p}</button>)}
    <button type="button" onClick={() => aoIr(pagina + 1)} disabled={pagina === paginas} aria-label="Próxima página">»</button>
  </nav>;
}
