"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();
  const [biz, setBiz] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setUser(u.user);
      const { data } = await supabase.from("businesses").select("*").eq("id", id).single();
      setBiz(data);
      const { data: ph } = await supabase.from("photos").select("*").eq("business_id", id as string).order("created_at", { ascending: true });
      setPhotos(ph || []);
      const { data: rv } = await supabase.from("reviews").select("*").eq("business_id", id as string).order("created_at", { ascending: false });
      setReviews(rv || []);
      if (rv && rv.length) {
        setAvg(rv.reduce((s, r) => s + (r.rating || 0), 0) / rv.length);
      } else {
        setAvg(null);
      }
    })();
  }, [id]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("reviews").insert({ business_id: id as string, rating, comment, author_name: user?.email || "User" });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    // refresh list
    const { data: rv } = await supabase.from("reviews").select("*").eq("business_id", id as string).order("created_at", { ascending: false });
    setReviews(rv || []);
    if (rv && rv.length) setAvg(rv.reduce((s, r) => s + (r.rating || 0), 0) / rv.length);
    setComment("");
    setRating(5);
    if (typeof window !== 'undefined') alert('Review submitted');
  }

  if (!biz) return <main className="mx-auto max-w-3xl p-6">Loading...</main>;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-2">{biz.name}</h1>
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">{[biz.category, biz.city, biz.country].filter(Boolean).join(" • ")}</div>
      {avg != null && <div className="mb-4 text-yellow-600">Average rating: {avg.toFixed(1)} / 5 ({reviews.length})</div>}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {photos.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.url} alt={biz.name} className="h-32 w-full object-cover rounded" />
        ))}
      </div>
      {biz.description && <p className="mb-4">{biz.description}</p>}
      {biz.phone && <div className="mb-1">Phone: {biz.phone}</div>}
      {biz.website && <a href={biz.website} target="_blank" className="underline">Website</a>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        <ul className="space-y-3 mb-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded border p-3">
              <div className="text-yellow-700">Rating: {r.rating} / 5</div>
              {r.comment && <div className="text-sm">{r.comment}</div>}
              <div className="text-xs text-gray-500">— {r.author_name || "User"}</div>
            </li>
          ))}
        </ul>
        {user ? (
          <form onSubmit={submitReview} className="flex flex-col gap-2 max-w-md">
            <label className="text-sm">Your rating</label>
            <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))} className="border rounded px-3 py-2 w-32">
              {[5,4,3,2,1].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment (optional)" className="border rounded px-3 py-2" />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button className="btn btn-primary disabled:opacity-60 w-40" disabled={submitting}>{submitting ? <span className="spinner" /> : 'Submit review'}</button>
          </form>
        ) : (
          <div className="text-sm">Please <a href="/login" className="underline">login</a> to add a review.</div>
        )}
      </section>
    </main>
  );
}


