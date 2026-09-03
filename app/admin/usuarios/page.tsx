import { inviteUserAction, updateRoleAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireEditor } from "@/lib/admin";

export default async function AdminUsersPage({searchParams}:{searchParams:Promise<{erro?:string;convite?:string}>}) {
  const [{supabase,profile},query]=await Promise.all([requireEditor(),searchParams]);
  if(!supabase||profile?.role!=="admin") return <AdminShell profile={profile}><h1>Acesso exclusivo para administradores.</h1></AdminShell>;
  const {data}=await supabase.from("profiles").select("id,name,role,created_at").order("created_at");
  return <AdminShell profile={profile}><span className="eyebrow">Permissões</span><h1 className="display-title" style={{fontSize:"2.5rem"}}>Usuários</h1>{query.erro&&<p style={{color:"#ff8d82"}}>Erro ao convidar: {query.erro}</p>}{query.convite&&<p style={{color:"#8ee59e"}}>Convite enviado. O usuário definirá uma senha antes do primeiro acesso.</p>}
    <form className="admin-form detail-panel" action={inviteUserAction}><label className="form-label">Nome<input className="field" name="name" required/></label><label className="form-label">E-mail<input className="field" name="email" type="email" required/></label><div className="full"><button className="gold-button">Convidar editor</button></div></form>
    <table className="admin-table"><thead><tr><th>Nome</th><th>Função</th><th>Alterar</th></tr></thead><tbody>{data?.map((user)=><tr key={user.id}><td>{user.name}</td><td>{user.role}</td><td><form action={updateRoleAction} style={{display:"flex",gap:8}}><input type="hidden" name="id" value={user.id}/><select className="field" name="role" defaultValue={user.role}><option value="editor">Editor</option><option value="admin">Admin</option></select><button className="ghost-button">Salvar</button></form></td></tr>)}</tbody></table>
  </AdminShell>;
}
