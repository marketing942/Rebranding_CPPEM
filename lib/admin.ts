import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/content";

export async function requireEditor() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase:null, profile:null, configured:false } as const;
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data:profile } = await supabase.from("profiles").select("id,name,role").eq("id",user.id).single();
  if (!profile || !(["admin","editor"] as UserRole[]).includes(profile.role)) redirect("/admin/login?erro=sem-permissao");
  return { supabase, profile:profile as {id:string;name:string;role:UserRole}, configured:true } as const;
}
