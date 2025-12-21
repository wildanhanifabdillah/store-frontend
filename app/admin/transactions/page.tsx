"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { clearAdminToken, getAdminToken } from "@/lib/auth";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");

  const hasToken =
    typeof window !== "undefined" && getAdminToken() ? true : false;

  useEffect(() => {
    if (!hasToken) {
      router.replace("/admin/login");
    }
  }, [hasToken, router]);

  const { data, isLoading, isError, refetch } = useAdminTransactions(status || undefined);
  const txs = useMemo(() => data || [], [data]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  if (!hasToken) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin - Transaksi</h1>
          <p className="text-slate-400 text-sm">Monitor pembayaran dan status</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/games"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
          >
            Kelola game
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full border border-red-500/60 text-red-200 px-4 py-2 text-sm font-semibold hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-12 space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Filter</p>
              <h2 className="text-lg font-semibold">Transaksi</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              >
                <option value="">Semua status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>
              <button
                onClick={() => refetch()}
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
              >
                Muat ulang
              </button>
            </div>
          </div>

          {isLoading && <p className="text-sm text-slate-300">Memuat transaksi...</p>}
          {isError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
              Gagal memuat transaksi.
            </div>
          )}

          {!isLoading && txs.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-300">
              Belum ada transaksi.
            </div>
          )}

          {!isLoading && txs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-300 border-b border-slate-800">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 pr-4">Game</th>
                    <th className="py-2 pr-4">Paket</th>
                    <th className="py-2 pr-4">User ID</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {txs.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2 pr-4 font-mono text-xs">{tx.order_id}</td>
                      <td className="py-2 pr-4">{tx.game?.name || "-"}</td>
                      <td className="py-2 pr-4">{tx.package?.name || "-"}</td>
                      <td className="py-2 pr-4">{tx.game_user_id}</td>
                      <td className="py-2 pr-4">{tx.email}</td>
                      <td className="py-2 pr-4 font-semibold text-emerald-300">
                        {formatCurrency(tx.total_amount)}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                            tx.status === "PAID"
                              ? "border-emerald-400 text-emerald-200"
                              : tx.status === "PENDING"
                              ? "border-amber-400 text-amber-200"
                              : "border-red-400 text-red-200"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <Link
                          href={`${process.env.NEXT_PUBLIC_API_URL}/admin/invoices/${tx.order_id}`}
                          className="text-sm text-emerald-300 hover:underline"
                        >
                          Unduh
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
