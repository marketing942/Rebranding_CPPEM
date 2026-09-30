import "server-only";
import { getContests } from "@/lib/data";
import { statusLabels } from "@/lib/constants";

export type FaixaDestaque = { etiqueta: string; texto: string; href: string };

/**
 * Concurso marcado em "Destaque na faixa" na base de concursos. A equipe liga,
 * escreve e escolhe o link pelo Notion: desmarcou, a faixa some do site todo.
 */
export async function getFaixaDestaque(): Promise<FaixaDestaque | null> {
  const emDestaque = (await getContests()).find((contest) => contest.strip);
  if (!emDestaque?.strip) return null;
  return { etiqueta: statusLabels[emDestaque.status], texto: emDestaque.strip.text, href: emDestaque.strip.href };
}
