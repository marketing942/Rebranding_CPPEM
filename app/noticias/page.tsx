import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NewsCard } from "@/components/news/news-card";
import { getNewsFeed } from "@/lib/news";

export const metadata: Metadata = {
  title: "Notícias de concursos",
  description: "Editais, bancas, datas e atualizações dos principais concursos policiais acompanhados pelo CPPEM.",
  alternates: { canonical: "/noticias" },
};
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ busca?: string | string[]; pagina?: string | string[] }> };

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("busca", query);
  if (page > 1) params.set("pagina", String(page));
  const suffix = params.toString();
  return suffix ? `/noticias?${suffix}` : "/noticias";
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = one(params.busca)?.trim() ?? "";
  const parsedPage = Number.parseInt(one(params.pagina) ?? "1", 10);
  const feed = await getNewsFeed({ query, page: Number.isNaN(parsedPage) ? 1 : parsedPage });
  const totalPages = Math.max(1, Math.ceil(feed.total / feed.pageSize));
  const showHighlights = feed.page === 1 && !feed.query && feed.articles.length > 0;
  const mainStory = showHighlights ? feed.articles[0] : null;
  const secondaryStories = showHighlights ? feed.articles.slice(1, 5) : [];
  const remainingStories = showHighlights ? feed.articles.slice(5) : feed.articles;

  return <div className="page-shell"><SiteHeader /><main>
    <section className="news-page-hero"><div className="container news-page-heading">
      <span className="eyebrow">Informação para decidir melhor</span>
      <h1 className="display-title">CPPEM <span className="gold">Notícias.</span></h1>
      <p className="section-copy">Editais, bancas, movimentações e tudo o que pode mudar a rota da sua preparação.</p>
    </div></section>

    <section className="news-page-content"><div className="container">
      <form className="news-search" action="/noticias" method="get">
        <label><span className="sr-only">Pesquisar notícias</span><Search size={19} aria-hidden="true" /><input name="busca" defaultValue={feed.query} placeholder="Busque por concurso, órgão ou assunto" /></label>
        <button className="gold-button" type="submit">Pesquisar</button>
        {feed.query && <Link className="ghost-button" href="/noticias">Limpar</Link>}
      </form>

      {feed.errorMessage && <div className="news-empty"><h2>Notícias indisponíveis</h2><p>{feed.errorMessage}</p></div>}

      {mainStory && <div className="news-highlights" aria-label="Últimas cinco notícias">
        <NewsCard article={mainStory} variant="featured" />
        <div className="news-secondary-list">{secondaryStories.map((article) => <NewsCard article={article} variant="compact" key={article.id} />)}</div>
      </div>}

      <div className="news-section-heading">
        <div><span className="eyebrow">Arquivo CPPEM</span><h2>{feed.query ? `Resultados para “${feed.query}”` : "Mais notícias"}</h2></div>
        <span>{feed.total} {feed.total === 1 ? "publicação" : "publicações"}</span>
      </div>

      {remainingStories.length > 0
        ? <div className="news-cards-grid">{remainingStories.map((article) => <NewsCard article={article} key={article.id} />)}</div>
        : !feed.errorMessage && <div className="news-empty"><h2>Nenhuma notícia encontrada</h2><p>Tente pesquisar por outro termo ou acompanhe as publicações mais recentes.</p>{feed.query && <Link className="gold-button" href="/noticias">Ver todas as notícias</Link>}</div>}

      {totalPages > 1 && <nav className="news-pagination" aria-label="Paginação de notícias">
        <Link className="ghost-button" aria-disabled={feed.page === 1} href={pageHref(Math.max(1, feed.page - 1), feed.query)}>Anterior</Link>
        <span>Página {feed.page} de {totalPages}</span>
        <Link className="ghost-button" aria-disabled={feed.page === totalPages} href={pageHref(Math.min(totalPages, feed.page + 1), feed.query)}>Próxima</Link>
      </nav>}
    </div></section>
  </main><SiteFooter /></div>;
}
