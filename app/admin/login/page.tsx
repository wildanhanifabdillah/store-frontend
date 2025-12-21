"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setAdminToken, getAdminToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasToken =
    typeof window !== "undefined" && getAdminToken() ? true : false;

  // Jika sudah login, langsung alihkan ke halaman admin
  useEffect(() => {
    if (hasToken) {
      router.replace("/admin/games");
    }
  }, [hasToken, router]);

  if (hasToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      const token = res.data?.token;
      if (token) {
        setAdminToken(token);
        router.replace("/admin/games");
      } else {
        setError("Token tidak ditemukan dari server.");
      }
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { message?: string } } };
      const msg =
        maybeErr.response?.data?.message || "Login gagal. Periksa email/password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-emerald-500/10">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
              placeholder="admin@mail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
