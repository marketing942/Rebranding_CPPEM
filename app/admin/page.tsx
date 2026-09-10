import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireEditor } from "@/lib/admin";
import { getContests } from "@/lib/data";

export default async function AdminPage() {
  const {profile,configured}=await requireEditor();
  if(!configured) return <AdminShell profile={null}><h1 className="display-title" style={{fontSize:"2.4rem"}}>Configure o Supabase</h1><p className="section-copy">O site público está usando dados de demonstração. Aplique a migration e preencha as variáveis de ambiente para ativar o CMS.</p><pre className="detail-panel">NEXT_PUBLIC_SUPABASE_URL={"\n"}NEXT_PUBLIC_SUPABASE_ANON_KEY=</pre></AdminShell>;
  const contests=await getContests();
  const notionConfigured=Boolean(process.env.NOTION_TOKEN&&process.env.NOTION_DATABASE_ID&&process.env.NOTION_BANNERS_DATABASE_ID&&process.env.NOTION_COURSES_DATABASE_ID&&process.env.NOTION_CONTESTS_DATABASE_ID);
  return <AdminShell profile={profile}><span className="eyebrow">Painel editorial</span><h1 className="display-title" style={{fontSize:"2.5rem"}}>Visão geral</h1><div className="admin-grid"><Metric label="Concursos publicados" value={contests.length}/><Metric label="Conteúdo no Notion" value={notionConfigured?"Ativo":"Pendente"}/><Metric label="Prova social" value="14 fotos"/></div><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="gold-button" href="/admin/concursos">Gerenciar concursos</Link><Link className="ghost-button" href="/admin/homepage">Ver fontes da Homepage</Link></div></AdminShell>;
}
function Metric({label,value}:{label:string;value:number|string}) { return <div className="admin-card"><span className="map-hint">{label}</span><strong>{value}</strong></div>; }
