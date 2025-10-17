"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseBrowserClient();
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setInfo("Please check your email to verify your account. After verification, you'll be redirected to your dashboard.");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Create Business Account</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm">Business Owner Name</label>
          <input className="border rounded px-3 py-2" placeholder="Chioma Okafor" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="text-sm">Email</label>
          <input className="border rounded px-3 py-2" placeholder="you@company.ng" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="text-sm">Password</label>
          <input className="border rounded px-3 py-2" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {info && <div className="text-green-600 text-sm">{info}</div>}
          <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>
            {loading ? <span className="spinner" /> : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-3">Already have an account? <a className="underline" href="/login">Login</a></p>
      </div>
    </main>
  );
}


