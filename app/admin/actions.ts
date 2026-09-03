"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireEditor } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/constants";
import { contestStatuses } from "@/types/content";

const cleanSlug = (value:string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const lines = (value:FormDataEntryValue|null) => String(value ?? "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);

const contestSchema = z.object({
  id:z.string().uuid().optional(), slug:z.string().min(3), title:z.string().min(3), acronym:z.string().min(2), organization:z.string().min(3), career:z.string().min(2),
  status:z.enum(contestStatuses), scope:z.enum(["estadual","federal","nacional"]), openings_label:z.string().min(1), salary_label:z.string().min(1), exam_board:z.string().min(1),
  summary:z.string().min(20), content_md:z.string().min(20), source_label:z.string().min(2), source_url:z.url().refine((value) => value.startsWith("https://"),"Use HTTPS"),
  last_verified_at:z.string().date(), published:z.boolean(), product_id:z.string().uuid().optional(),
});

export async function loginAction(formData:FormData) {
  const supabase = await createSupabaseServerClient(); if(!supabase) redirect("/admin/login?erro=configure-supabase");
  const email=String(formData.get("email")??""); const password=String(formData.get("password")??"");
  const { error } = await supabase.auth.signInWithPassword({email,password});
  if(error) redirect("/admin/login?erro=credenciais"); redirect("/admin");
}

export async function logoutAction() { const supabase=await createSupabaseServerClient(); await supabase?.auth.signOut(); redirect("/admin/login"); }

export async function saveContestAction(formData:FormData) {
  const {supabase,profile} = await requireEditor(); if(!supabase || !profile) redirect("/admin/concursos?erro=configure-supabase");
  const parsed = contestSchema.safeParse({
    id:formData.get("id") || undefined, slug:cleanSlug(String(formData.get("slug") || formData.get("title") || "")), title:formData.get("title"), acronym:formData.get("acronym"), organization:formData.get("organization"), career:formData.get("career"),
    status:formData.get("status"), scope:formData.get("scope"), openings_label:formData.get("openings_label"), salary_label:formData.get("salary_label"), exam_board:formData.get("exam_board"), summary:formData.get("summary"), content_md:formData.get("content_md"),
    source_label:formData.get("source_label"), source_url:formData.get("source_url"), last_verified_at:formData.get("last_verified_at"), published:formData.get("published") === "on", product_id:formData.get("product_id") || undefined,
  });
  if(!parsed.success) redirect(`/admin/concursos?erro=${encodeURIComponent(parsed.error.issues[0]?.message ?? "dados-invalidos")}`);
  const {id,product_id,...base}=parsed.data;
  const payload={...base,positions:lines(formData.get("positions")),requirements:lines(formData.get("requirements")),stages:lines(formData.get("stages")),updated_by:profile.id,published_at:base.published ? new Date().toISOString().slice(0,10) : null};
  const result = id ? await supabase.from("contests").update(payload).eq("id",id).select("id").single() : await supabase.from("contests").insert({...payload,created_by:profile.id}).select("id").single();
  if(result.error) redirect(`/admin/concursos?erro=${encodeURIComponent(result.error.message)}`);
  const contestId=result.data.id;
  await supabase.from("contest_locations").delete().eq("contest_id",contestId);
  const states=lines(formData.get("states")).map((state) => state.toUpperCase().slice(0,2));
  if(states.length) await supabase.from("contest_locations").insert(states.map((state_code) => ({contest_id:contestId,state_code})));
  await supabase.from("contest_products").delete().eq("contest_id",contestId);
  if(product_id) await supabase.from("contest_products").insert({contest_id:contestId,product_id});
  revalidatePath("/"); revalidatePath("/concursos","layout"); redirect("/admin/concursos?salvo=1");
}

async function uploadMedia(formData:FormData,key:string) {
  const file=formData.get(key); if(!(file instanceof File) || !file.size) return String(formData.get(`${key}_url`)??"");
  const {supabase}=await requireEditor(); if(!supabase) return "";
  const ext=file.name.split(".").pop()?.toLowerCase() || "webp"; const path=`${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}.${ext}`;
  const {error}=await supabase.storage.from("site-media").upload(path,file,{contentType:file.type,upsert:false}); if(error) throw new Error(error.message);
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export async function saveProductAction(formData:FormData) {
  const {supabase,profile}=await requireEditor(); if(!supabase||!profile) redirect("/admin/homepage?erro=configure-supabase");
  const image_url=await uploadMedia(formData,"image");
  const payload={slug:cleanSlug(String(formData.get("slug")||formData.get("name")||"")),name:String(formData.get("name")||""),category:String(formData.get("category")||""),modality:String(formData.get("modality")||""),description:String(formData.get("description")||""),price_label:String(formData.get("price_label")||""),old_price_label:String(formData.get("old_price_label")||"")||null,image_url,href:String(formData.get("href")||""),featured:formData.get("featured")==="on",published:formData.get("published")==="on",display_order:Number(formData.get("display_order"))||0,created_by:profile.id,updated_by:profile.id};
  const {error}=await supabase.from("products").insert(payload); if(error) redirect(`/admin/homepage?erro=${encodeURIComponent(error.message)}`); revalidatePath("/"); redirect("/admin/homepage?salvo=produto");
}

export async function saveBannerAction(formData:FormData) {
  const {supabase,profile}=await requireEditor(); if(!supabase||!profile) redirect("/admin/homepage?erro=configure-supabase");
  const image_url=await uploadMedia(formData,"image"); const mobile_image_url=await uploadMedia(formData,"mobile_image") || null;
  const payload={eyebrow:String(formData.get("eyebrow")||""),title:String(formData.get("title")||""),highlight:String(formData.get("highlight")||""),description:String(formData.get("description")||""),image_url,mobile_image_url,cta_label:String(formData.get("cta_label")||""),href:String(formData.get("href")||""),starts_at:formData.get("starts_at")||null,ends_at:formData.get("ends_at")||null,published:formData.get("published")==="on",display_order:Number(formData.get("display_order"))||0,created_by:profile.id,updated_by:profile.id};
  const {error}=await supabase.from("campaign_banners").insert(payload); if(error) redirect(`/admin/homepage?erro=${encodeURIComponent(error.message)}`); revalidatePath("/"); redirect("/admin/homepage?salvo=banner");
}

export async function saveTestimonialAction(formData:FormData) {
  const {supabase,profile}=await requireEditor(); if(!supabase||!profile) redirect("/admin/homepage?erro=configure-supabase");
  const image_url=await uploadMedia(formData,"image"); const payload={name:String(formData.get("name")||""),result:String(formData.get("result")||""),quote:String(formData.get("quote")||""),image_url,published:formData.get("published")==="on",display_order:Number(formData.get("display_order"))||0,created_by:profile.id,updated_by:profile.id};
  const {error}=await supabase.from("testimonials").insert(payload); if(error) redirect(`/admin/homepage?erro=${encodeURIComponent(error.message)}`); revalidatePath("/"); redirect("/admin/homepage?salvo=depoimento");
}

export async function updateRoleAction(formData:FormData) {
  const {supabase,profile}=await requireEditor(); if(!supabase||profile?.role!=="admin") redirect("/admin");
  const id=String(formData.get("id")); const role=formData.get("role")==="admin"?"admin":"editor"; await supabase.from("profiles").update({role}).eq("id",id); revalidatePath("/admin/usuarios");
}

export async function inviteUserAction(formData:FormData) {
  const {profile}=await requireEditor(); if(profile?.role!=="admin") redirect("/admin");
  const admin=createSupabaseAdminClient(); if(!admin) redirect("/admin/usuarios?erro=service-role");
  const email=z.email().parse(String(formData.get("email")||"")); const name=z.string().min(2).parse(String(formData.get("name")||""));
  const {error}=await admin.auth.admin.inviteUserByEmail(email,{data:{name},redirectTo:`${siteUrl}/auth/callback?next=/admin/definir-senha`});
  if(error) redirect(`/admin/usuarios?erro=${encodeURIComponent(error.message)}`); redirect("/admin/usuarios?convite=1");
}

export async function updatePasswordAction(formData:FormData) {
  const supabase=await createSupabaseServerClient(); if(!supabase) redirect("/admin/login");
  const password=z.string().min(10).parse(String(formData.get("password")||"")); const {error}=await supabase.auth.updateUser({password});
  if(error) redirect(`/admin/definir-senha?erro=${encodeURIComponent(error.message)}`); redirect("/admin");
}

const homepageTables={product:"products",banner:"campaign_banners",testimonial:"testimonials"} as const;

export async function toggleHomepageItemAction(formData:FormData) {
  const {supabase}=await requireEditor(); if(!supabase) redirect("/admin/homepage");
  const entity=String(formData.get("entity")) as keyof typeof homepageTables; const table=homepageTables[entity]; if(!table) redirect("/admin/homepage?erro=entidade-invalida");
  const {error}=await supabase.from(table).update({published:formData.get("published")==="true"}).eq("id",String(formData.get("id")));
  if(error) redirect(`/admin/homepage?erro=${encodeURIComponent(error.message)}`); revalidatePath("/"); redirect("/admin/homepage?salvo=status");
}

export async function deleteHomepageItemAction(formData:FormData) {
  const {supabase,profile}=await requireEditor(); if(!supabase||profile?.role!=="admin") redirect("/admin/homepage?erro=apenas-admin-exclui");
  const entity=String(formData.get("entity")) as keyof typeof homepageTables; const table=homepageTables[entity]; if(!table) redirect("/admin/homepage?erro=entidade-invalida");
  const {error}=await supabase.from(table).delete().eq("id",String(formData.get("id")));
  if(error) redirect(`/admin/homepage?erro=${encodeURIComponent(error.message)}`); revalidatePath("/"); redirect("/admin/homepage?salvo=excluido");
}
