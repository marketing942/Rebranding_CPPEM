import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { ProductCarousel } from "@/components/home/product-carousel";
import { StudentProof } from "@/components/home/student-proof";
import { HomeContestExplorerServer } from "@/components/home/home-contest-explorer-server";
import { NewsCard } from "@/components/news/news-card";
import { AnimatedStat } from "@/components/about/animated-stat";
import { AboutHowItWorks } from "@/components/about/about-how-it-works";
import { AboutTicker } from "@/components/about/about-ticker";
import { getBanners, getContests, getNews, getProducts } from "@/lib/data";
import { approvedStudentImages } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Preparação para concursos policiais", alternates: { canonical: "/" } };
export const revalidate = 300;

export default async function HomePage() {
  const [banners,products,contests,news] = await Promise.all([getBanners(),getProducts(),getContests(),getNews()]);
  return <div className="page-shell"><SiteHeader/><main>
    <HeroCarousel banners={banners}/>

    <AboutTicker/>

    <section className="section section-alt home-proof-section">
      <div className="container home-proof-head">
        <div className="section-heading">
          <span className="eyebrow">Prova social</span>
          <h2 className="display-title">Quem se prepara, <span className="gold">avança.</span></h2>
        </div>
        <div className="home-proof-stats">
          <AnimatedStat prefix="+" start={1000} end={14000} label="alunos aprovados"/>
          <AnimatedStat start={1} end={7} suffix="+" label="anos de estrada" duration={1500}/>
          <article className="about-stat"><strong>Caruaru–PE</strong><span>unidade presencial</span></article>
        </div>
      </div>
      <StudentProof images={approvedStudentImages}/>
    </section>
    

    <AboutHowItWorks/>

    <section className="section section-alt"><div className="container"><HomeContestExplorerServer contests={contests}/></div></section>

    <section className="section" id="preparacoes"><div className="container"><div className="section-heading"><span className="eyebrow">Destaques</span><h2 className="display-title">Escolha sua próxima <span className="gold">missão.</span></h2><p className="section-copy">Cursos e materiais organizados para você encontrar rapidamente a preparação certa para o seu objetivo.</p></div><ProductCarousel products={products}/><div style={{marginTop:24}}><Link className="ghost-button" href="/cursos">Ver todas as preparações <ArrowRight size={16}/></Link></div></div></section>

    {news.length > 0 && <section className="section section-alt"><div className="container"><div className="section-heading"><span className="eyebrow">Noticias</span><h2 className="display-title">Últimas do <span className="gold">CPPEM.</span></h2><p className="section-copy">Editais, bancas e movimentações que podem mudar a rota da sua preparação.</p></div><div className="news-grid">{news.map((item, index) => <NewsCard article={item} variant={index === 0 ? "featured" : "standard"} key={item.id} />)}</div><div style={{marginTop:24}}><Link className="ghost-button" href="/noticias">Ver todas as notícias</Link></div></div></section>}
  </main><SiteFooter/></div>;
}
