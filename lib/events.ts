// usado no servidor e no navegador (menu): nada de server-only aqui
const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "18 out" a partir de "2026-10-18", sem passar por fuso horario */
export function formatEventDate(date: string | null) {
  if (!date) return null;
  const [, mes, dia] = date.split("-").map(Number);
  return { day: String(dia).padStart(2, "0"), month: meses[mes - 1] ?? "" };
}
