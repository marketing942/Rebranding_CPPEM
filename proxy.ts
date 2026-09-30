import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request:NextRequest) {
  // sem prefixo primeiro: NEXT_PUBLIC_* e congelado no build do Docker
  const url=process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) return NextResponse.next({request});
  let response=NextResponse.next({request});
  const supabase=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll:(entries)=>{entries.forEach(({name,value})=>request.cookies.set(name,value)); response=NextResponse.next({request}); entries.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  const {data:{user}}=await supabase.auth.getUser();
  if(request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname!=="/admin/login" && !user) { const next=request.nextUrl.clone(); next.pathname="/admin/login"; return NextResponse.redirect(next); }
  return response;
}
export const config={matcher:["/admin/:path*","/auth/:path*"]};
