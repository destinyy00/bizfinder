import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  // Supabase will set the session in URL hash on the client; for SSR, just redirect to dashboard with a toast hint.
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/dashboard";
  return NextResponse.redirect(new URL(`${next}?verified=1`, req.url));
}


