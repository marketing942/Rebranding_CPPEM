export type PartnerCategory = { key: string; label: string };

export type Partner = {
  id: string;
  name: string;
  categoryKey: string;
  categoryLabel: string;
  description: string;
  benefit: string;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  logoUrl: string | null;
  featured: boolean;
};

export const partnerCategories: PartnerCategory[] = [
  { key: "saude", label: "Saúde" },
  { key: "taf", label: "TAF" },
  { key: "estetica", label: "Estética" },
  { key: "comedoria", label: "Comedoria" },
  { key: "educacao", label: "Educação" },
  { key: "servicos", label: "Serviços" },
];

export function normalizePartnerKey(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function partnerInitials(name: string) {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return words.length ? words.slice(0, 2).map((word) => word[0]).join("").toUpperCase() : "?";
}
