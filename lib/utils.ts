import { statusOrder } from "@/lib/constants";
import type { Contest } from "@/types/content";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

export function sortContests(items: Contest[]) {
  return [...items].sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.lastVerifiedAt.localeCompare(a.lastVerifiedAt));
}

export function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export function filterContests(items: Contest[], filters: { q?: string; state?: string; status?: string; career?: string; scope?: string }) {
  const query = normalizeSearch(filters.q ?? "");
  return sortContests(items.filter((item) => {
    const haystack = normalizeSearch([item.title, item.acronym, item.organization, item.career, ...item.positions].join(" "));
    return (!query || haystack.includes(query))
      && (!filters.state || item.states.includes(filters.state))
      && (!filters.status || item.status === filters.status)
      && (!filters.career || item.career === filters.career)
      && (!filters.scope || item.scope === filters.scope);
  }));
}
