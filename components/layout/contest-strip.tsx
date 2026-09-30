import "server-only";
import { getContests } from "@/lib/data";
import { statusLabels } from "@/lib/constants";
import { ContestStripClient } from "@/components/layout/contest-strip-client";

/**
 * Faixa do concurso em destaque. Quem liga e escreve e a equipe, pelas colunas
 * "Destaque na faixa", "Texto da faixa" e "Link da faixa" da base de concursos:
 * desmarcou, a faixa some do site inteiro sem precisar de deploy.
 */
export async function ContestStrip() {
  const emDestaque = (await getContests()).find((contest) => contest.strip);
  if (!emDestaque?.strip) return null;

  return <ContestStripClient
    etiqueta={statusLabels[emDestaque.status]}
    texto={emDestaque.strip.text}
    href={emDestaque.strip.href}
  />;
}
