import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("category")
      .not("category", "is", null);
    if (error) throw error;
    const categories = Array.from(
      new Set((data || []).map((r: any) => (r.category as string).trim()).filter(Boolean))
    ).sort();
    return NextResponse.json({ categories });
  } catch (e) {
    return NextResponse.json({ categories: [] });
  }
}


