"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
    else router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Business Login</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm">Email</label>
          <input className="border rounded px-3 py-2" placeholder="you@company.ng" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="text-sm">Password</label>
          <input className="border rounded px-3 py-2" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>
            {loading ? <span className="spinner" /> : "Login"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-3">No account? <a className="underline" href="/register">Register</a></p>
      </div>
    </main>
  );
}


