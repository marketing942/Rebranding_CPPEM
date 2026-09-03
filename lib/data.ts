import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fallbackContests } from "@/lib/mock-data";
import { getLatestNews } from "@/lib/news";
import { getNotionBanners, getNotionProducts } from "@/lib/notion/homepage";
import { getNotionCourses } from "@/lib/notion/courses";
import { sortContests } from "@/lib/utils";
import type { CampaignBanner, Contest, CourseProduct, Product } from "@/types/content";

function productFromRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id), slug: String(row.slug), name: String(row.name), category: String(row.category), modality: String(row.modality),
    description: String(row.description), price: String(row.price_label), oldPrice: row.old_price_label ? String(row.old_price_label) : null,
    imageUrl: String(row.image_url), href: String(row.href), featured: Boolean(row.featured),
    career: row.career ? String(row.career) : "", acronym: row.acronym ? String(row.acronym) : "",
    menuFeatured: Boolean(row.menu_featured), menuImageUrl: row.menu_image_url ? String(row.menu_image_url) : null,
    menuOrder: typeof row.menu_order === "number" ? row.menu_order : null,
  };
}

function contestFromRow(row: Record<string, unknown>): Contest {
  const locations = (row.contest_locations as Array<{ state_code?: string }> | null) ?? [];
  const links = (row.contest_products as Array<{ products?: Record<string, unknown> }> | null) ?? [];
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), acronym: String(row.acronym), organization: String(row.organization),
    career: String(row.career), status: row.status as Contest["status"], states: locations.map((location) => location.state_code).filter(Boolean) as string[],
    scope: row.scope as Contest["scope"], openings: String(row.openings_label), salary: String(row.salary_label), examBoard: String(row.exam_board),
    positions: (row.positions as string[]) ?? [], summary: String(row.summary), contentMd: String(row.content_md),
    requirements: (row.requirements as string[]) ?? [], stages: (row.stages as string[]) ?? [], sourceLabel: String(row.source_label),
    sourceUrl: String(row.source_url), lastVerifiedAt: String(row.last_verified_at), publishedAt: String(row.published_at),
    product: links[0]?.products ? productFromRow(links[0].products) : null,
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await getNotionProducts()) ?? [];
}

export async function getCourseProducts(): Promise<CourseProduct[]> {
  return (await getNotionCourses()) ?? [];
}

export async function getContests(): Promise<Contest[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return sortContests(fallbackContests);
  const { data, error } = await supabase.from("contests").select("*, contest_locations(state_code), contest_products(products(*))").eq("published", true);
  if (error) { console.error("[supabase] Falha ao carregar concursos:",error.message); return []; }
  return sortContests((data ?? []).map((row) => contestFromRow(row)));
}

export async function getContestBySlug(slug: string): Promise<Contest | null> {
  const contests = await getContests();
  return contests.find((contest) => contest.slug === slug) ?? null;
}

export async function getContestRedirect(slug:string):Promise<string|null> {
  const supabase=await createSupabaseServerClient();
  if(!supabase) return null;
  const {data}=await supabase.from("slug_redirects").select("new_slug").eq("entity_type","contest").eq("old_slug",slug).maybeSingle();
  return data?.new_slug ?? null;
}

export async function getBanners(): Promise<CampaignBanner[]> {
  return (await getNotionBanners()) ?? [];
}

export async function getNews() {
  return getLatestNews(3);
}
