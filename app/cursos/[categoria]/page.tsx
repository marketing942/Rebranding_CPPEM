import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { courseCategories, getCourseCategory } from "@/lib/course-categories";
import { getCourseProducts } from "@/lib/data";

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return courseCategories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cursos/[categoria]">): Promise<Metadata> {
  const { categoria: slug } = await params;
  const category = getCourseCategory(slug);
  if (!category) return {};
  return {
    title: `Cursos para ${category.label}`,
    description: category.description,
    alternates: { canonical: `/cursos/${category.slug}` },
  };
}

export default async function CourseCategoryPage({ params }: PageProps<"/cursos/[categoria]">) {
  const { categoria: slug } = await params;
  const category = getCourseCategory(slug);
  if (!category) notFound();
  const products = (await getCourseProducts()).filter((product) => product.career === category.label);

  return <div className="page-shell"><SiteHeader /><main>
    <section className="course-catalog-hero"><div className="container">
      <span className="eyebrow">Cursos por carreira</span>
      <h1 className="display-title">Preparações para<br /><span className="gold">{category.label}.</span></h1>
      <p className="section-copy">{category.description}</p>
    </div></section>
    <section className="course-catalog-section"><div className="container"><CourseCatalog products={products} activeSlug={category.slug} /></div></section>
  </main><SiteFooter /></div>;
}
