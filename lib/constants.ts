import type { ContestStatus } from "@/types/content";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cppem.com.br";
export const whatsappNumber = "558173105354";

export const northeastStates = ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"] as const;

export const stateNames: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí",
  RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul",
  RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo",
  SE: "Sergipe", TO: "Tocantins",
};

export const ibgeCodeToState: Record<string, string> = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL",
  "28": "SE", "29": "BA", "31": "MG", "32": "ES", "33": "RJ", "35": "SP", "41": "PR",
  "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF",
};

export const statusLabels: Record<ContestStatus, string> = {
  publicado: "Edital publicado",
  "em-andamento": "Em andamento",
  autorizado: "Autorizado",
  "banca-definida": "Banca definida",
  "comissao-formada": "Comissão formada",
  previsto: "Previsto",
  solicitado: "Solicitado",
  encerrado: "Encerrado",
};

export const statusOrder: Record<ContestStatus, number> = {
  publicado: 0,
  "em-andamento": 1,
  autorizado: 2,
  "banca-definida": 3,
  "comissao-formada": 4,
  previsto: 5,
  solicitado: 6,
  encerrado: 7,
};

export function whatsappHref(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
