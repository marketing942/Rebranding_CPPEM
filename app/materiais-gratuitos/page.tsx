import type { Metadata } from "next";
import { BookOpen, Layers3, RefreshCw, Target } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContentLibrary } from "@/components/free-content/content-library";
import { FreePageHero } from "@/components/free-content/free-page-hero";
import { getFreeMaterials } from "@/lib/notion/free-content";

export const metadata: Metadata = { title: "Materiais gratuitos", description: "Cadernos, questões e materiais gratuitos para concursos policiais.", alternates: { canonical: "/materiais-gratuitos" } };
export const dynamic = "force-dynamic";

export default async function FreeMaterialsPage({ searchParams }: { searchParams: Promise<{ material?: string | string[] }> }) {
  const materials = await getFreeMaterials();
  const params = await searchParams;
  const initialSelectedId = Array.isArray(params.material) ? params.material[0] : params.material;
  return <div className="page-shell"><SiteHeader /><main>
    <FreePageHero icon={BookOpen} eyebrow="Arsenal gratuito" title="Material para transformar intenção em " accent="execução." description="Cadernos de questões, desafios e ferramentas de estudo selecionadas pela equipe CPPEM. Baixe, aplique e avance." count={materials.length} />
    <section className="free-library-section"><div className="container"><div className="free-section-heading"><span className="eyebrow">Biblioteca CPPEM</span><h2 className="display-title">Escolha sua próxima <span className="gold">ferramenta.</span></h2><p></p></div><ContentLibrary items={materials} kind="materials" initialSelectedId={initialSelectedId} /></div></section>
    <section className="free-method-section"><div className="container free-method-grid"><article><Layers3 /><span>01</span><h3>Escolha com intenção</h3><p>Comece pelo material que responde à dificuldade mais urgente da sua preparação.</p></article><article><Target /><span>02</span><h3>Execute com prazo</h3><p>Transforme o conteúdo em uma missão objetiva dentro do seu plano semanal.</p></article><article><RefreshCw /><span>03</span><h3>Revise o resultado</h3><p>Meça seus erros, volte aos pontos frágeis e repita até consolidar.</p></article></div></section>
  </main><SiteFooter /></div>;
}
