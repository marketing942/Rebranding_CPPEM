import "server-only";
import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;

type OpcoesNotion = NonNullable<ConstructorParameters<typeof Client>[0]>;

// O Notion aceita ~3 requisicoes por segundo por integracao. Em build ou em
// revalidacao varias paginas pedem dados ao mesmo tempo e estouram esse teto,
// entao toda chamada passa por aqui e sai espacada.
const INTERVALO_MS = 340;
let proximaSaida = 0;

async function aguardarVez() {
  const agora = Date.now();
  const inicio = Math.max(agora, proximaSaida);
  proximaSaida = inicio + INTERVALO_MS;
  if (inicio > agora) await new Promise((resolve) => setTimeout(resolve, inicio - agora));
}

const fetchRitmado: NonNullable<OpcoesNotion["fetch"]> = async (url, init) => {
  await aguardarVez();
  return fetch(url, init as RequestInit);
};

export const notion = token
  ? new Client({
      auth: token,
      fetch: fetchRitmado,
      // o padrao (2 tentativas) desiste cedo demais: cada leitura tem catch que
      // devolve lista vazia, entao a pagina iria ao ar sem conteudo
      retry: { maxRetries: 5, initialRetryDelayMs: 900 },
    })
  : null;
