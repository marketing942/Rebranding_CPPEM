import { AdminShell } from "@/components/admin/admin-shell";
import { ContestForm } from "@/components/admin/contest-form";
import { requireEditor } from "@/lib/admin";

export default async function NewContestPage() { const {supabase,profile,configured}=await requireEditor(); const products=configured&&supabase?(await supabase.from("products").select("id,name").order("name")).data??[]:[]; return <AdminShell profile={profile}><span className="eyebrow">Catálogo</span><h1 className="display-title" style={{fontSize:"2.5rem"}}>Novo concurso</h1><ContestForm products={products}/></AdminShell>; }
