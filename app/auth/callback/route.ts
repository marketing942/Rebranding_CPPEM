import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request:Request) { const url=new URL(request.url); const code=url.searchParams.get("code"); if(code){ const supabase=await createSupabaseServerClient(); await supabase?.auth.exchangeCodeForSession(code); } const requested=url.searchParams.get("next"); const next=requested?.startsWith("/admin/")?requested:"/admin"; return NextResponse.redirect(new URL(next,url.origin)); }
