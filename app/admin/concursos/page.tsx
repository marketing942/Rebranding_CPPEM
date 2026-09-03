import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireEditor } from "@/lib/admin";
import { statusLabels } from "@/lib/constants";

const adminStatusLabel = (status:string) => statusLabels[status as keyof typeof statusLabels] ?? status;

export default async function AdminContestsPage({searchParams}:{searchParams:Promise<{erro?:string;salvo?:string}>}) {
  const [{supabase,profile,configured},query]=await Promise.all([requireEditor(),searchParams]);
  if(!configured||!supabase) return <AdminShell profile={null}><h1>Configure o Supabase para gerenciar concursos.</h1></AdminShell>;
  const {data}=await supabase.from("contests").select("id,title,acronym,status,published,last_verified_at").order("updated_at",{ascending:false});
  return <AdminShell profile={profile}><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:16}}><div><span className="eyebrow">Catálogo</span><h1 className="display-title" style={{fontSize:"2.5rem"}}>Concursos</h1></div><Link className="gold-button" href="/admin/concursos/novo">Novo concurso</Link></div>{query.erro&&<p style={{color:"#ff8d82"}}>Erro: {query.erro}</p>}{query.salvo&&<p style={{color:"#8ee59e"}}>Concurso salvo e páginas revalidadas.</p>}<table className="admin-table"><thead><tr><th>Concurso</th><th>Status</th><th>Verificação</th><th>Publicação</th><th></th></tr></thead><tbody>{data?.map((row)=><tr key={row.id}><td><strong>{row.acronym}</strong> — {row.title}</td><td>{adminStatusLabel(row.status)}</td><td>{row.last_verified_at}</td><td>{row.published?"Publicado":"Rascunho"}</td><td><Link className="ghost-button" href={`/admin/concursos/${row.id}`}>Editar</Link></td></tr>)}</tbody></table></AdminShell>;
}
