import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getSupabasePublicEnv() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY
    ?? process.env.SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return url && key ? { url, key } : null;
}

export function createSupabasePublicClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  return createClient(env.url, env.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
