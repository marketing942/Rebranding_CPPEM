import { AdminShell } from "@/components/admin/admin-shell";
import { requireEditor } from "@/lib/admin";

export default async function AdminHomepagePage() {
  const { profile } = await requireEditor();
  const notionConfigured = Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID && process.env.NOTION_BANNERS_DATABASE_ID && process.env.NOTION_COURSES_DATABASE_ID);

  return <AdminShell profile={profile}>
    <span className="eyebrow">Conteúdo comercial</span>
    <h1 className="display-title" style={{fontSize:"2.5rem"}}>Homepage</h1>
    <div className="detail-panel" style={{marginTop:18}}>
      <span className="product-category">Fonte compartilhada</span>
      <h2 className="product-name" style={{marginTop:8}}>Banners e vitrine são gerenciados no Notion</h2>
      <p className="section-copy">A nova Homepage lê as mesmas bases utilizadas pelo site anterior. Assim, campanhas e produtos continuam sendo publicados em um único lugar, sem duplicação no Supabase.</p>
      <p className="map-hint" style={{marginTop:16}}>Integração neste ambiente: {notionConfigured ? "configurada" : "aguardando as três variáveis do Notion"}.</p>
    </div>
    <div className="detail-panel" style={{marginTop:18}}>
      <span className="product-category">Prova social</span>
      <h2 className="product-name" style={{marginTop:8}}>Galeria visual de alunos</h2>
      <p className="section-copy">Esta seção usa somente as imagens aprovadas do acervo CPPEM. Nomes, resultados e depoimentos não são gerados nem exibidos.</p>
    </div>
    <div className="detail-panel" style={{marginTop:18}}>
      <span className="product-category">Catálogo de cursos</span>
      <h2 className="product-name" style={{marginTop:8}}>A base Cursos CPPEM controla as preparações</h2>
      <p className="section-copy"><strong>Carreira</strong> define em qual página o produto aparece; <strong>Sigla</strong> identifica PMPE, PMAL, PCPE e similares; <strong>Destaque no menu</strong> envia o produto para o banner da navbar; <strong>Imagem do menu</strong> permite uma arte exclusiva; e <strong>Ordem no menu</strong> controla a sequência do carrossel.</p>
      <p className="section-copy"><strong>Vagas, salário, inscrições, escolaridade, prova, TAF, redação, banca e títulos</strong> alimentam o painel de detalhes. A relação <strong>Preparações extras</strong> seleciona, diretamente na Vitrine CPPEM, os materiais complementares exibidos em cada curso.</p>
    </div>
  </AdminShell>;
}
