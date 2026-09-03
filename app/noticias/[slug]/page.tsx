/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { formatNewsDate, getNewsArticle, splitNewsContent } from "@/lib/news";

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(decodeURIComponent(slug));
  if (!article) return { title: "Notícia não encontrada" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/noticias/${encodeURIComponent(article.routeKey)}` },
    openGraph: { title: article.title, description: article.excerpt, type: "article", publishedTime: article.publishedAt ?? undefined, images: [article.imageUrl] },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticle(decodeURIComponent(slug));
  if (!article) notFound();
  const paragraphs = splitNewsContent(article.content);

  return <div className="page-shell"><SiteHeader /><main>
    <article className="news-detail"><div className="container news-detail-container">
      <Link className="news-back" href="/noticias"><ArrowLeft size={16} /> Voltar para notícias</Link>
      <header className="news-detail-header">
        <span className="eyebrow">CPPEM News</span>
        <h1>{article.title}</h1>
        <div className="news-detail-meta"><span><CalendarDays size={16} />{formatNewsDate(article.publishedAt, true)}</span><span><Clock3 size={16} />{article.readingMinutes} min de leitura</span></div>
        <p>{article.excerpt}</p>
      </header>
      <div className="news-detail-cover"><img src={article.imageUrl} alt="" /></div>
      <div className="news-article-copy">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {article.linkUrl && <a className="ghost-button news-original-link" href={article.linkUrl} target="_blank" rel="noreferrer">Consultar fonte original <ExternalLink size={15} /></a>}
    </div></article>
  </main><SiteFooter /></div>;
}
