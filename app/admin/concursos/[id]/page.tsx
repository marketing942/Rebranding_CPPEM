import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContestForm } from "@/components/admin/contest-form";
import { requireEditor } from "@/lib/admin";

export default async function EditContestPage({params}:{params:Promise<{id:string}>}) { const {supabase,profile}=await requireEditor(); if(!supabase) notFound(); const id=(await params).id; const [{data:contest},{data:products}]=await Promise.all([supabase.from("contests").select("*,contest_locations(state_code),contest_products(product_id)").eq("id",id).single(),supabase.from("products").select("id,name").order("name")]); if(!contest)notFound(); return <AdminShell profile={profile}><span className="eyebrow">Editar catálogo</span><h1 className="display-title" style={{fontSize:"2.5rem"}}>{contest.acronym}</h1><ContestForm contest={contest} products={products??[]}/></AdminShell>; }
