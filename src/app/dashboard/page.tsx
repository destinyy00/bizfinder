"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const supabase = getSupabaseBrowserClient();
  const [me, setMe] = useState<{ id: string; email: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) setMe({ id: u.id, email: u.email ?? "" });
    });
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('verified') === '1') {
        setNotice('Email verified! Welcome.');
        url.searchParams.delete('verified');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  async function createBusiness(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    const { data, error: err } = await supabase.from("businesses").insert({
      name: form.name,
      category: form.category || null,
      description: form.description || null,
      phone: form.phone || null,
      website: form.website || null,
      city: form.city || null,
      state: form.state || null,
      country: form.country || null,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      owner_id: me?.id,
    }).select("id").single();
    if (err) setError(err.message);
    else {
      setCreatedBusinessId(data?.id ?? null);
      window.location.href = "/dashboard/my-businesses?created=1";
    }
    setCreating(false);
  }

  async function uploadImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createdBusinessId) return;
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;
    if (!file) return;
    setUploading(true);
    const filePath = `${createdBusinessId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("photos").upload(filePath, file, { upsert: false });
    if (upErr) { setError(upErr.message); return; }
    const { data: pub } = supabase.storage.from("photos").getPublicUrl(filePath);
    const url = pub.publicUrl;
    await supabase.from("photos").insert({ business_id: createdBusinessId, url, caption: form.name });
    setUploading(false);
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-md p-6">
        <p className="mb-4">You need to login to manage your business.</p>
        <div className="flex gap-3">
          <a className="underline" href="/login">Login</a>
          <a className="underline" href="/register">Register</a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      {notice && <div className="mb-4 rounded border border-green-300 text-green-800 px-3 py-2">{notice}</div>}
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>
      <div className="mb-6 flex items-center gap-3">
        <a href="/dashboard/my-businesses" className="btn btn-outline">My Businesses</a>
        <a href="#create" className="btn btn-primary">Add New Business</a>
      </div>
      <form id="create" onSubmit={createBusiness} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Business Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        {error && <div className="text-red-600 text-sm col-span-2">{error}</div>}
        <button className="rounded bg-black text-white px-4 py-2 col-span-2 disabled:opacity-60" disabled={creating}>
          {creating ? <span className="spinner" /> : "Create Business"}
        </button>
      </form>

      {createdBusinessId && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Upload a photo</h2>
          <form onSubmit={uploadImage} className="flex items-center gap-3">
            <input type="file" name="file" accept="image/*" className="border rounded px-3 py-2" />
            <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60" disabled={uploading}>
              {uploading ? <span className="spinner" /> : "Upload"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}


