import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser/client-side Supabase (uses anon key)
export function getSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL/ANON");
  return createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

// Server-side Supabase (uses service role for admin operations)
export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !service) throw new Error("Missing SUPABASE env keys");
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const __placeholder = true;
