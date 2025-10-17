"use client";

import { useEffect, useMemo, useState } from "react";

type Result = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  avgRating: number | null;
  photoUrl: string | null;
  distanceKm: number | null;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [radiusKm, setRadiusKm] = useState(25);
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState<"recent" | "rating" | "distance">("recent");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    // load categories once for suggestions
    fetch("/api/categories").then((r) => r.json()).then((d) => setAllCategories(d.categories || []));
  }, []);

  useEffect(() => {
    const term = q.toLowerCase();
    if (!term) { setSuggestions([]); return; }
    const matches = allCategories.filter((c) => c.toLowerCase().includes(term)).slice(0, 6);
    setSuggestions(matches);
  }, [q, allCategories]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (coords) {
      params.set("lat", String(coords.lat));
      params.set("lng", String(coords.lng));
      params.set("radiusKm", String(radiusKm));
    }
    params.set("limit", String(limit));
    params.set("sort", sort);
    return params.toString();
  }, [q, coords, radiusKm, limit, sort]);

  async function doSearchWith(query: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (coords) {
      params.set("lat", String(coords.lat));
      params.set("lng", String(coords.lng));
      params.set("radiusKm", String(radiusKm));
    }
    params.set("limit", String(limit));
    params.set("sort", sort);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    await doSearchWith(q);
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-4">Search businesses</h1>
      <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          placeholder="Search (e.g., amala, barber, pharmacy, mechanic)"
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 z-10 w-full sm:w-80 bg-white text-gray-900 dark:bg-black dark:text-white border border-gray-200 dark:border-neutral-800 rounded shadow">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900 text-gray-900 dark:text-white"
                onClick={() => {
                  setQ(s);
                  setShowSuggestions(false);
                  setSuggestions([]);
                  void doSearchWith(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Radius (km)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseInt(e.target.value || "25", 10))}
            className="w-24 rounded border border-gray-300 px-2 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Limit</label>
          <input
            type="number"
            min={1}
            max={50}
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value || "20", 10))}
            className="w-20 rounded border border-gray-300 px-2 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded border border-gray-300 px-2 py-2">
            <option value="recent">Most recent</option>
            <option value="rating">Highest rated</option>
            <option value="distance">Closest</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {!coords && (
        <p className="text-sm text-gray-600 mt-2">Location access denied. Showing text results only.</p>
      )}

      {results.length === 0 && (
        <p className="text-gray-600 mt-6">No businesses found. Try another search or category.</p>
      )}
      <ul className="mt-6 space-y-4">
        {results.map((r) => (
          <li
            key={r.id}
            className="rounded border border-gray-200 p-4 flex gap-4 cursor-pointer bg-white hover:bg-gray-50 shadow-sm dark:bg-black dark:hover:bg-neutral-900"
            onClick={() => (window.location.href = `/business/${r.id}`)}
          >
            {r.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.photoUrl} alt={r.name} className="h-20 w-20 rounded object-cover" />
            ) : (
              <div className="h-20 w-20 rounded bg-gray-200" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{r.name}</h2>
                {r.distanceKm != null && (
                  <span className="text-sm text-gray-700 dark:text-gray-300">{r.distanceKm.toFixed(1)} km</span>
                )}
              </div>
              {r.avgRating != null && (
                <div className="text-sm text-yellow-700 dark:text-yellow-500">Rating: {r.avgRating.toFixed(1)} / 5</div>
              )}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {[r.category, r.city, r.state, r.country].filter(Boolean).join(" • ")}
              </div>
              {r.phone && <div className="text-sm text-gray-800 dark:text-gray-200">Phone: {r.phone}</div>}
              {r.website && (
                <a href={r.website} target="_blank" rel="noreferrer" className="text-sm underline text-blue-700 dark:text-blue-400">
                  Website
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


