import type { MetadataRoute } from "next";
import { getContests } from "@/lib/data";
import { siteUrl } from "@/lib/constants";
import { courseCategories } from "@/lib/course-categories";
import { getNewsSitemapEntries } from "@/lib/news";

export default async function sitemap():Promise<MetadataRoute.Sitemap> { const [contests,news]=await Promise.all([getContests(),getNewsSitemapEntries()]); const routes=["","/quem-somos","/cursos","/presencial","/plano-de-combate","/concursos","/concursos/lista","/noticias","/parceiros","/glossario","/editais","/materiais-gratuitos",...courseCategories.map((category)=>`/cursos/${category.slug}`)].map((path)=>({url:`${siteUrl}${path}`,changeFrequency:"daily" as const,priority:path===""?1:.8})); return [...routes,...contests.map((contest)=>({url:`${siteUrl}/concursos/${contest.slug}`,lastModified:contest.lastVerifiedAt,changeFrequency:"weekly" as const,priority:.7})),...news.map((article)=>({url:`${siteUrl}/noticias/${encodeURIComponent(article.routeKey)}`,lastModified:article.lastModified,changeFrequency:"weekly" as const,priority:.65}))]; }
