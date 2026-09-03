export const courseCategories = [
  { slug: "policia-rodoviaria-federal", label: "Polícia Rodoviária Federal", shortLabel: "PRF", description: "Preparações direcionadas às carreiras da Polícia Rodoviária Federal." },
  { slug: "policia-federal", label: "Polícia Federal", shortLabel: "PF", description: "Cursos e materiais para as diferentes carreiras da Polícia Federal." },
  { slug: "depen", label: "DEPEN", shortLabel: "DEPEN", description: "Preparações para carreiras do sistema penitenciário federal." },
  { slug: "policia-civil", label: "Polícia Civil", shortLabel: "PC", description: "Preparações por estado para agentes, escrivães, delegados e demais cargos." },
  { slug: "policia-penal", label: "Polícia Penal", shortLabel: "PP", description: "Cursos e materiais organizados para concursos de Polícia Penal." },
  { slug: "policia-militar", label: "Polícia Militar", shortLabel: "PM", description: "Preparações como PMPE, PMAL, PMCE, PMPR e outras Polícias Militares." },
  { slug: "guarda-municipal", label: "Guarda Municipal", shortLabel: "GM", description: "Preparações para concursos de Guardas Municipais em todo o Brasil." },
] as const;

export type CourseCategory = (typeof courseCategories)[number];
export type CourseCategorySlug = CourseCategory["slug"];

export function getCourseCategory(slug: string): CourseCategory | undefined {
  return courseCategories.find((category) => category.slug === slug);
}
