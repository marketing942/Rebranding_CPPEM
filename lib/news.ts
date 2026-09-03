import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const NEWS_TABLE = "noticias";
const FALLBACK_IMAGE = "/images/bgnews.webp";
export const NEWS_PAGE_SIZE = 14;

type RawNewsRow = Record<string, unknown>;

export type NewsArticle = {
  id: string;
  routeKey: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  linkUrl: string | null;
  isExternal: boolean;
  publishedAt: string | null;
  readingMinutes: number;
};

export type NewsFeed = {
  articles: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  errorMessage: string | null;
};

function pickString(row: RawNewsRow, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function stripMarkup(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_>`~\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content: string) {
  const plain = stripMarkup(content);
  if (!plain) return "Confira os detalhes desta notícia no CPPEM News.";
  return plain.length > 170 ? `${plain.slice(0, 167).trimEnd()}…` : plain;
}

function normalizeNewsRow(row: RawNewsRow): NewsArticle {
  const id = String(row.id ?? "");
  const title = pickString(row, "titulo", "title") ?? "Notícia CPPEM";
  const content = pickString(row, "corpo", "conteudo", "content") ?? "";
  const routeKey = pickString(row, "slug") ?? id;
  // A identidade editorial usa uma única capa institucional. A imagem recebida
  // pelo agregador permanece no banco para auditoria, mas não é exibida no site.
  const imageUrl = FALLBACK_IMAGE;
  const linkUrl = pickString(row, "link", "url");
  const publishedAt = pickString(row, "publicado_em", "published_at", "created_at");
  const words = stripMarkup(content).split(/\s+/).filter(Boolean).length;

  return {
    id,
    routeKey,
    title,
    excerpt: makeExcerpt(content),
    content,
    imageUrl,
    linkUrl,
    isExternal: Boolean(row.is_external && linkUrl),
    publishedAt,
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
  };
}

function normalizeSearchTerms(query: string) {
  return query
    .split(/\s+/)
    .map((term) => term.trim().replace(/[%_,]/g, ""))
    .filter(Boolean)
    .slice(0, 6);
}

async function fetchLatestNews(limit: number) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(NEWS_TABLE)
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(Math.max(1, Math.min(limit, 20)));

  if (error) {
    console.error("[noticias] Falha ao carregar últimas notícias:", error.message);
    return [];
  }

  return (data ?? []).map((row) => normalizeNewsRow(row as RawNewsRow));
}

export const getLatestNews = unstable_cache(fetchLatestNews, ["cppem-latest-news"], {
  revalidate: 300,
  tags: ["noticias"],
});

export async function getNewsFeed({
  query = "",
  page = 1,
  pageSize = NEWS_PAGE_SIZE,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<NewsFeed> {
  const cleanQuery = query.trim();
  const currentPage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 24));
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return { articles: [], total: 0, page: currentPage, pageSize: safePageSize, query: cleanQuery, errorMessage: "A fonte de notícias ainda não está configurada." };
  }

  let request = supabase
    .from(NEWS_TABLE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false, nullsFirst: false });

  for (const term of normalizeSearchTerms(cleanQuery)) {
    const token = `%${term}%`;
    request = request.or(`titulo.ilike.${token},corpo.ilike.${token},slug.ilike.${token}`);
  }

  const from = (currentPage - 1) * safePageSize;
  const { data, error, count } = await request.range(from, from + safePageSize - 1);

  if (error) {
    console.error("[noticias] Falha ao carregar listagem:", error.message);
    return { articles: [], total: 0, page: currentPage, pageSize: safePageSize, query: cleanQuery, errorMessage: "Não foi possível carregar as notícias agora. Tente novamente em instantes." };
  }

  return {
    articles: (data ?? []).map((row) => normalizeNewsRow(row as RawNewsRow)),
    total: count ?? 0,
    page: currentPage,
    pageSize: safePageSize,
    query: cleanQuery,
    errorMessage: null,
  };
}

export async function getNewsArticle(routeKey: string) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const bySlug = await supabase.from(NEWS_TABLE).select("*").eq("slug", routeKey).limit(1).maybeSingle();
  if (bySlug.data) return normalizeNewsRow(bySlug.data as RawNewsRow);

  const byId = await supabase.from(NEWS_TABLE).select("*").eq("id", routeKey).limit(1).maybeSingle();
  return byId.data ? normalizeNewsRow(byId.data as RawNewsRow) : null;
}

export async function getNewsSitemapEntries() {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(NEWS_TABLE)
    .select("id,slug,created_at,is_external")
    .eq("is_external", false)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []).map((row) => ({
    routeKey: String(row.slug || row.id),
    lastModified: row.created_at ? new Date(row.created_at) : undefined,
  }));
}

export function newsHref(article: NewsArticle) {
  return article.isExternal && article.linkUrl ? article.linkUrl : `/noticias/${encodeURIComponent(article.routeKey)}`;
}

export function formatNewsDate(value: string | null, long = false) {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", long
    ? { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Fortaleza" }
    : { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Fortaleza" }
  ).format(date);
}

export function splitNewsContent(content: string) {
  return content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
