"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { courseCategories } from "@/lib/course-categories";
import type { CourseProduct } from "@/types/content";

export type Filtros = { busca: string; tipo: string | null; carreira: string | null; faixa: string | null; ordem: string; pagina: number };

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

// "relevância" é a ordem em que o aluno decide: preparação primeiro, depois o
// que complementa. Sem isso o catálogo abre com vade mecum e camiseta.
const PESO = ["Curso online", "Curso unificado", "Preparação presencial", "Plano de Combate", "Combo",
  "Resumo bizurado", "Caderno de questões", "Vade mecum", "Curso isolado", "E-book e ferramentas",
  "Vestuário e acessórios", "Evento", "Outros"];

export function valorDe(preco: string) {
  const numero = Number(preco.replace(/[^\d,]/g, "").replace(",", "."));
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

// a busca ignora acento: quem digita "policia" tem que achar "Polícia"
export const normalizar = (valor: string) => valor.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function aplicar(produtos: CourseProduct[], filtros: Filtros) {
  let lista = produtos;
  const termo = normalizar(filtros.busca.trim());
  if (termo) {
    const partes = termo.split(/\s+/);
    lista = lista.filter((p) => {
      const alvo = normalizar([p.name, p.acronym, p.career, p.type, p.description].filter(Boolean).join(" "));
      return partes.every((parte) => alvo.includes(parte));
    });
  }
  if (filtros.tipo) lista = lista.filter((p) => p.type === filtros.tipo);
  if (filtros.carreira) lista = lista.filter((p) => p.career === filtros.carreira);
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

export function CourseSidebar({ produtos, filtros, aoMudar, activeSlug }: {
  produtos: CourseProduct[];
  filtros: Filtros;
  aoMudar: (filtros: Filtros) => void;
  activeSlug?: string;
}) {
  // a contagem de cada opção considera os outros filtros já marcados
  const conta = (teste: (p: CourseProduct) => boolean, ignorar: "tipo" | "carreira" | "faixa") => {
    let base = aplicar(produtos, { ...filtros, tipo: null, carreira: null, faixa: null, ordem: "rel", pagina: 1 });
    if (filtros.tipo && ignorar !== "tipo") base = base.filter((p) => p.type === filtros.tipo);
    if (filtros.carreira && ignorar !== "carreira") base = base.filter((p) => p.career === filtros.carreira);
    if (filtros.faixa && ignorar !== "faixa") {
      const faixa = FAIXAS.find((f) => f.rotulo === filtros.faixa);
      base = base.filter((p) => { const v = valorDe(p.price); return v !== null && faixa!.teste(v); });
    }
    return base.filter(teste).length;
  };
  const alterna = (campo: "tipo" | "carreira" | "faixa", valor: string) =>
    aoMudar({ ...filtros, [campo]: filtros[campo] === valor ? null : valor, pagina: 1 });

  const carreiras = [...new Set(produtos.map((p) => p.career).filter((c): c is string => Boolean(c)))]
    .map((carreira) => ({ carreira, total: conta((p) => p.career === carreira, "carreira") }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total);

  return <aside className="course-sidebar" aria-label="Filtros do catálogo">
    <div className="course-sidebar-block course-sidebar-search">
      <h2>Buscar</h2>
      <div className="course-search-field">
        <Search size={15} aria-hidden="true" />
        <input type="search" value={filtros.busca} placeholder="Curso, material ou sigla"
          aria-label="Buscar no catálogo"
          onChange={(evento) => aoMudar({ ...filtros, busca: evento.target.value, pagina: 1 })} />
        {filtros.busca && <button type="button" aria-label="Limpar busca"
          onClick={() => aoMudar({ ...filtros, busca: "", pagina: 1 })}><X size={14} /></button>}
      </div>
    </div>

    <div className="course-sidebar-block">
      <h2>Categorias</h2>
      <ul>
        {GRUPOS.map(({ grupo, tipos }) => {
          const disponiveis = tipos.map((tipo) => ({ tipo, total: conta((p) => p.type === tipo, "tipo") }))
            .filter(({ total }) => total > 0);
          if (!disponiveis.length) return null;
          return <li key={grupo}>
            <span className="course-sidebar-group">{grupo}</span>
            <ul>{disponiveis.map(({ tipo, total }) => <li key={tipo}>
              <button type="button" aria-pressed={filtros.tipo === tipo} onClick={() => alterna("tipo", tipo)}>
                <span>{tipo}</span><em>{total}</em>
              </button>
            </li>)}</ul>
          </li>;
        })}
      </ul>
    </div>

    <div className="course-sidebar-block">
      <h2>Carreira</h2>
      {activeSlug
        ? <ul>
            <li><Link href="/produtos">Todas as carreiras</Link></li>
            {courseCategories.map((categoria) => <li key={categoria.slug}>
              <Link href={`/produtos/${categoria.slug}`} aria-current={activeSlug === categoria.slug ? "page" : undefined}>{categoria.label}</Link>
            </li>)}
          </ul>
        : <ul>{carreiras.map(({ carreira, total }) => <li key={carreira}>
            <button type="button" aria-pressed={filtros.carreira === carreira} onClick={() => alterna("carreira", carreira)}>
              <span>{carreira}</span><em>{total}</em>
            </button>
          </li>)}</ul>}
    </div>

    <div className="course-sidebar-block">
      <h2>Filtrar por preço</h2>
      <ul>{FAIXAS.map(({ rotulo, teste }) => {
        const total = conta((p) => { const v = valorDe(p.price); return v !== null && teste(v); }, "faixa");
        if (!total) return null;
        return <li key={rotulo}>
          <button type="button" aria-pressed={filtros.faixa === rotulo} onClick={() => alterna("faixa", rotulo)}>
            <span>{rotulo}</span><em>{total}</em>
          </button>
        </li>;
      })}</ul>
    </div>

    {(filtros.busca || filtros.tipo || filtros.carreira || filtros.faixa) && <button className="course-sidebar-clear" type="button"
      onClick={() => aoMudar({ ...filtros, busca: "", tipo: null, carreira: null, faixa: null, pagina: 1 })}>
      <X size={13} aria-hidden="true" /> Limpar filtros
    </button>}
  </aside>;
}

export function CourseToolbar({ total, filtros, aoMudar }: {
  total: number;
  filtros: Filtros;
  aoMudar: (filtros: Filtros) => void;
}) {
  const marcados = ([["busca", filtros.busca.trim()], ["tipo", filtros.tipo], ["carreira", filtros.carreira], ["faixa", filtros.faixa]] as const)
    .filter(([, valor]) => valor);
  return <>
    <div className="course-toolbar">
      <span className="course-toolbar-count"><b>{total}</b> item(ns) encontrado(s)</span>
      <label className="course-toolbar-order">
        Ordenar por
        <select value={filtros.ordem} onChange={(evento) => aoMudar({ ...filtros, ordem: evento.target.value, pagina: 1 })}>
          <option value="rel">Relevância</option>
          <option value="menor">Menor preço</option>
          <option value="maior">Maior preço</option>
        </select>
      </label>
    </div>
    {marcados.length > 0 && <div className="course-toolbar-tags">
      {marcados.map(([campo, valor]) => <span className="course-tag" key={campo}>
        {campo === "busca" ? `“${valor}”` : valor}
        <button type="button" aria-label={`Remover filtro ${valor}`} onClick={() => aoMudar({ ...filtros, [campo]: campo === "busca" ? "" : null, pagina: 1 })}>×</button>
      </span>)}
    </div>}
  </>;
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
