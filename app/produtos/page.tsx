import type { Metadata } from "next";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCourseProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Produtos para concursos policiais",
  description: "Conheça as preparações, cursos e materiais do CPPEM organizados por carreira policial.",
  alternates: { canonical: "/produtos" },
};
export const revalidate = 300;

export default async function CoursesPage() {
  const products = await getCourseProducts();

  return <div className="page-shell"><SiteHeader /><main>
    <section className="course-catalog-hero"><div className="container">
      <span className="eyebrow">Preparações CPPEM</span>
      <h1 className="display-title">Escolha a carreira.<br /><span className="gold">Nós traçamos a missão.</span></h1>
      <p className="section-copy">Cursos, materiais e preparações organizados para você encontrar o caminho certo até a aprovação.</p>
    </div></section>
    <section className="course-catalog-section"><div className="container"><CourseCatalog products={products} /></div></section>
  </main><SiteFooter /></div>;
}
