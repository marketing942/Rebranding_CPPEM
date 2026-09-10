import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireEditor } from "@/lib/admin";
import { getContests } from "@/lib/data";

const contestsDatabaseUrl = "https://app.notion.com/p/677e142c8bd649d7a201fa1680f9b79c";

export default async function AdminContestsPage() {
  const [{ profile }, contests] = await Promise.all([requireEditor(), getContests()]);

  return <AdminShell profile={profile}>
    <span className="eyebrow">Fonte editorial</span>
    <h1 className="display-title" style={{ fontSize: "2.5rem" }}>Concursos no Notion</h1>
    <p className="section-copy">A equipe cadastra e revisa os concursos diretamente no Sis. Site. O novo site exibe somente registros marcados como publicados e com data de verificação.</p>
    <div className="admin-grid">
      <div className="admin-card"><span className="map-hint">Publicados no site</span><strong>{contests.length}</strong></div>
      <div className="admin-card"><span className="map-hint">Fonte de verdade</span><strong>Notion</strong></div>
      <div className="admin-card"><span className="map-hint">Vínculo com cursos</span><strong>Por sigla</strong></div>
    </div>
    <Link className="gold-button" href={contestsDatabaseUrl} target="_blank" rel="noreferrer">Abrir Concursos CPPEM no Notion</Link>
  </AdminShell>;
}
