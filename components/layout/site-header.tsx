import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { getCourseProducts } from "@/lib/data";
import { getFreeMaterials } from "@/lib/notion/free-content";
import { getEcosystemItems } from "@/lib/notion/ecosystem";

export async function SiteHeader() {
  const [products, materials, ecosystemItems] = await Promise.all([getCourseProducts(), getFreeMaterials(), getEcosystemItems()]);
  const featuredCourses = products
    .filter((product) => product.menuFeatured)
    .sort((a, b) => (a.menuOrder ?? Number.MAX_SAFE_INTEGER) - (b.menuOrder ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 5);
  const markedMaterials = materials
    .filter((material) => material.menuFeatured)
    .sort((a, b) => (a.menuOrder ?? Number.MAX_SAFE_INTEGER) - (b.menuOrder ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 5);
  const featuredMaterials = markedMaterials.length > 0 ? markedMaterials : materials.slice(0, 1);

  return <SiteHeaderClient featuredCourses={featuredCourses} featuredMaterials={featuredMaterials} ecosystemItems={ecosystemItems} />;
}
