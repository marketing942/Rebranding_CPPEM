/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { formatNewsDate, newsHref, type NewsArticle } from "@/lib/news";

type Variant = "featured" | "compact" | "standard";

export function NewsCard({ article, variant = "standard" }: { article: NewsArticle; variant?: Variant }) {
  const href = newsHref(article);
  const external = article.isExternal && Boolean(article.linkUrl);
  const content = <>
    <div className="news-media">
      <img src={article.imageUrl} alt="" loading={variant === "featured" ? "eager" : "lazy"} />
      <span className="news-image-shade" />
    </div>
    <div className="news-copy-block">
      <span className="news-kicker">CPPEM News</span>
      <h2>{article.title}</h2>
      {variant !== "compact" && <p>{article.excerpt}</p>}
      <div className="news-card-meta">
        <span><CalendarDays size={14} aria-hidden="true" />{formatNewsDate(article.publishedAt)}</span>
        {variant !== "compact" && <span><Clock3 size={14} aria-hidden="true" />{article.readingMinutes} min</span>}
        {external && <span className="news-source-label">Fonte externa <ArrowUpRight size={13} /></span>}
      </div>
    </div>
  </>;

  const className = `news-story news-story-${variant}`;
  return <article className={className}>
    {external
      ? <a href={href} target="_blank" rel="noreferrer">{content}</a>
      : <Link href={href}>{content}</Link>}
  </article>;
}
