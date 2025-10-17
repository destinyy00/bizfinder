import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseClient";

type SearchParams = {
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number; // default 25km
  limit?: number; // default 20
};

function parseParams(req: NextRequest): SearchParams {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = searchParams.get("radiusKm");
  const limit = searchParams.get("limit");

  const toNum = (v: string | null) => {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    q,
    lat: toNum(lat),
    lng: toNum(lng),
    radiusKm: toNum(radiusKm) ?? 25,
    limit: Math.min(toNum(limit) ?? 20, 50),
  };
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  const { q, lat, lng, radiusKm, limit } = parseParams(req);
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") as "recent" | "rating" | "distance") || "recent";

  try {
    const supabase = getSupabaseServerClient();

    // Build query
    const safeTake = Math.max((limit ?? 20) * 3, 50);
    let query = supabase
      .from("businesses")
      .select("*, photos:photos(url), reviews:reviews(rating)")
      .order("created_at", { ascending: false })
      .limit(safeTake);

    if (q) {
      const term = q.toLowerCase().trim();
      const categoryMap: Record<string, string[]> = {
        barber: ["Salon"],
        "barber shop": ["Salon"],
        salon: ["Salon"],
        hair: ["Salon"],
        beauty: ["Salon"],
        food: ["Restaurant"],
        restaurant: ["Restaurant"],
        suya: ["Restaurant"],
        jollof: ["Restaurant"],
        pharmacy: ["Pharmacy"],
        chemist: ["Pharmacy"],
        health: ["Pharmacy"],
        auto: ["Mechanic"],
        mechanic: ["Mechanic"],
        car: ["Mechanic"],
      };
      const cityHints = [
        "Lagos","Abuja","Port Harcourt","Kano","Ibadan","Accra","Nairobi","Johannesburg","Kigali","Dakar","Abidjan"
      ];
      const mappedCategories = Object.keys(categoryMap).includes(term)
        ? categoryMap[term]
        : [];
      const matchedCities = cityHints.filter((c) => c.toLowerCase().includes(term));

      const orParts: string[] = [];
      orParts.push(`name.ilike.%${q}%`);
      orParts.push(`description.ilike.%${q}%`);
      if (mappedCategories.length) {
        orParts.push(`category.in.(${mappedCategories.map((c) => `"${c}"`).join(',')})`);
      } else {
        orParts.push(`category.ilike.%${q}%`);
      }
      if (matchedCities.length) {
        orParts.push(`city.in.(${matchedCities.map((c) => `"${c}"`).join(',')})`);
      } else {
        orParts.push(`city.ilike.%${q}%`);
      }
      query = query.or(orParts.join(','));
    }

    // If no query/location, return up to 5 per category to populate demo
    let data: any[] = [];
    if (!q && (lat == null || lng == null)) {
      const { data: rows, error: e1 } = await supabase
        .from("businesses")
        .select("category")
        .not("category", "is", null);
      if (e1) throw e1;
      const categories = Array.from(new Set((rows ?? []).map((r: any) => r.category).filter(Boolean))) as string[];
      for (const category of categories) {
        const { data: byCat, error: e2 } = await supabase
          .from("businesses")
          .select("*, photos:photos(url), reviews:reviews(rating)")
          .eq("category", category)
          .order("created_at", { ascending: false })
          .limit(5);
        if (e2) throw e2;
        data.push(...(byCat ?? []));
      }
    } else {
      const { data: d, error } = await query;
      if (error) throw error;
      data = d ?? [];
    }

    let results = data.map((b: any) => {
      const rs = Array.isArray(b.reviews) ? b.reviews : [];
      const ps = Array.isArray(b.photos) ? b.photos : [];
      const avgRating = rs.length ? rs.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / rs.length : null;
      const distanceKm = lat != null && lng != null
        ? haversineDistanceKm(lat, lng, b.latitude, b.longitude)
        : null;
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        category: b.category,
        phone: b.phone,
        website: b.website,
        city: b.city,
        state: b.state,
        country: b.country,
        latitude: b.latitude,
        longitude: b.longitude,
        avgRating,
        photoUrl: ps[0]?.url ?? null,
        distanceKm,
      };
    });

    if (sort === "distance" && lat != null && lng != null) {
      results = results
        .filter((r) => r.distanceKm != null && r.distanceKm <= (radiusKm ?? 25))
        .sort((a, b) => (a.distanceKm! - b.distanceKm!));
    } else if (sort === "rating") {
      results = results.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
    }

    results = results.slice(0, limit ?? 20);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("/api/search error", err);
    // Last-resort fallback: return some businesses instead of 500 in demo
    try {
      const { data: fallback } = await getSupabaseServerClient()
        .from("businesses")
        .select("*, photos:photos(url), reviews:reviews(rating)")
        .order("created_at", { ascending: false })
        .limit(20);
      const mapped = (fallback ?? []).map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        category: b.category,
        phone: b.phone,
        website: b.website,
        city: b.city,
        state: b.state,
        country: b.country,
        latitude: b.latitude,
        longitude: b.longitude,
        avgRating: (Array.isArray(b.reviews) && b.reviews.length) ? b.reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / b.reviews.length : null,
        photoUrl: (Array.isArray(b.photos) && b.photos[0]) ? b.photos[0].url : null,
        distanceKm: null,
      }));
      return NextResponse.json({ results: mapped });
    } catch (e) {
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
  }
}


