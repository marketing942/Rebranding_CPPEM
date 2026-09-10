import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLatestNews } from "@/lib/news";
import { getNotionBanners, getNotionProducts } from "@/lib/notion/homepage";
import { getNotionCourses } from "@/lib/notion/courses";
import { getNotionContests } from "@/lib/notion/contests";
import { sortContests } from "@/lib/utils";
import type { CampaignBanner, Contest, CourseProduct, Product } from "@/types/content";

export async function getProducts(): Promise<Product[]> {
  return (await getNotionProducts()) ?? [];
}

export async function getCourseProducts(): Promise<CourseProduct[]> {
  return (await getNotionCourses()) ?? [];
}

export async function getContests(): Promise<Contest[]> {
  const courses = await getCourseProducts();
  return sortContests((await getNotionContests(courses)) ?? []);
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
