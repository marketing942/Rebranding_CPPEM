import "server-only";
import { getContests } from "@/lib/data";
import { statusLabels } from "@/lib/constants";
import type { Contest } from "@/types/content";

export type FaixaDestaque = { etiqueta: string; texto: string; href: string; tom: "vermelho" | "azul" };

// Polícia Civil usa o azul da corporação; o resto segue no vermelho de alerta
function faixaDe(contest: Contest): FaixaDestaque | null {
  if (!contest.strip) return null;
  return {
    etiqueta: statusLabels[contest.status],
    texto: contest.strip.text,
    href: contest.strip.href,
    tom: contest.career === "Polícia Civil" ? "azul" : "vermelho",
  };
}

/**
 * Concursos marcados em "Destaque na faixa" na base de concursos. A equipe liga,
 * escreve e escolhe o link pelo Notion: desmarcou, a faixa some do site todo.
 * Com mais de um marcado, as faixas empilham pela data de publicação, a mais
 * recente em cima.
 */
export async function getFaixasDestaque(): Promise<FaixaDestaque[]> {
  return (await getContests())
    .filter((contest) => contest.strip)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(faixaDe)
    .filter((faixa): faixa is FaixaDestaque => faixa !== null);
}

export async function getFaixaDestaque(): Promise<FaixaDestaque | null> {
  return (await getFaixasDestaque())[0] ?? null;
}
