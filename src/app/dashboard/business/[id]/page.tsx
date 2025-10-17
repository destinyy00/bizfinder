"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function EditBusinessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [form, setForm] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single();
      setForm(data);
      const { data: ph } = await supabase.from("photos").select("url").eq("business_id", id as string).order("created_at", { ascending: true }).limit(1);
      setPhotoUrl(ph && ph[0]?.url ? ph[0].url : null);
    })();
  }, [id]);

  async function doSave() {
    setSaving(true);
    setError(null);
    const payload = { ...form };
    const { error: err } = await supabase.from("businesses").update(payload).eq("id", id);
    setSaving(false);
    if (err) { setError(err.message); return false; }
    return true;
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Save changes to this business?');
      if (!ok) return;
    }
    const ok = await doSave();
    if (ok) router.push("/dashboard/my-businesses");
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;
    if (!file) return;
    setUploading(true);
    const filePath = `${id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("photos").upload(filePath, file, { upsert: false });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("photos").getPublicUrl(filePath);
    const url = pub.publicUrl;
    await supabase.from("photos").insert({ business_id: id as string, url, caption: form.name });
    setPhotoUrl(url);
    if (typeof window !== 'undefined') {
      const proceed = window.confirm('Photo uploaded successfully. Save changes now?');
      if (proceed) await doSave();
    }
    setUploading(false);
  }

  if (!form) return <main className="mx-auto max-w-2xl p-6">Loading...</main>;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Business</h1>
      {photoUrl && (
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="Business" className="h-32 w-32 rounded object-cover" />
        </div>
      )}
      <form onSubmit={onSave} className="grid grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Business Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Category" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Website" value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="State" value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Country" value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Latitude" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value || "0") })} />
        <input className="border rounded px-3 py-2" placeholder="Longitude" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value || "0") })} />
        {error && <div className="text-red-600 text-sm col-span-2">{error}</div>}
        <button className="rounded bg-black text-white px-4 py-2 col-span-2 disabled:opacity-60" disabled={saving}>
          {saving ? <span className="spinner" /> : "Save Changes"}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Upload Photo</h2>
        <form onSubmit={onUpload} className="flex items-center gap-3">
          <input type="file" name="file" accept="image/*" className="border rounded px-3 py-2" />
          <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60" disabled={uploading}>
            {uploading ? <span className="spinner" /> : "Upload"}
          </button>
        </form>
      </div>
    </main>
  );
}


