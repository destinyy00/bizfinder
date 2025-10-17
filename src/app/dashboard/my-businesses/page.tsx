"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";

type Biz = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  country: string | null;
  created_at?: string;
  photos?: { url: string }[];
  reviews?: { rating: number }[];
};

export default function MyBusinessesPage() {
  const supabase = getSupabaseBrowserClient();
  const [biz, setBiz] = useState<Biz[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("businesses")
        .select("id,name,category,city,country,created_at, photos(url), reviews(rating)")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setBiz((data as Biz[]) || []);
      setLoading(false);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.get('created') === '1') {
          setNotice('Business created successfully.');
          url.searchParams.delete('created');
          window.history.replaceState({}, '', url.toString());
        }
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Businesses</h1>
        <a href="/dashboard#create" className="btn btn-primary">Add New</a>
      </div>
      {notice && <div className="mb-4 rounded border border-green-300 text-green-800 px-3 py-2">{notice}</div>}
      {loading && <div>Loading...</div>}
      {!loading && biz.length === 0 && (
        <div className="text-gray-600">No businesses yet. <Link href="/dashboard" className="underline">Create one</Link>.</div>
      )}
      <ul className="space-y-4">
        {biz.map((b) => {
          const ratings = Array.isArray(b.reviews) ? b.reviews : [];
          const avg = ratings.length ? ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length : null;
          const photo = Array.isArray(b.photos) && b.photos[0]?.url ? b.photos[0].url : null;
          return (
            <li key={b.id} className="rounded border p-4 flex gap-4 items-center">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={b.name} className="h-16 w-16 rounded object-cover" />
              ) : (
                <div className="h-16 w-16 rounded bg-gray-200" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{b.name}</div>
                  <Link href={`/dashboard/business/${b.id}`} className="btn btn-outline">Edit</Link>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {[b.category, b.city, b.country].filter(Boolean).join(" • ")}
                </div>
                {avg != null && (
                  <div className="text-sm text-yellow-600">Rating: {avg.toFixed(1)} / 5 ({ratings.length})</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}


