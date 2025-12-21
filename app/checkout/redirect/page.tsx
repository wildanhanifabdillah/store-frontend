"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type TransactionStatus = {
  order_id: string;
  status: string;
  total_amount: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutRedirectPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");

  const txQuery = useQuery<TransactionStatus>({
    queryKey: ["transaction-status", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const res = await api.get(`/transactions/${orderId}`);
      return res.data as TransactionStatus;
    },
    refetchInterval: (data) => {
      if (!data) return false;
      return data.status.toUpperCase() === "PENDING" ? 4000 : false;
    },
    retry: 1,
  });

  const statusLabel = (() => {
    const status = txQuery.data?.status?.toUpperCase();
    if (!status) return "Menunggu status...";
    if (status === "PENDING") return "Menunggu pembayaran...";
    if (status === "SETTLEMENT" || status === "SUCCESS") return "Pembayaran berhasil";
    if (status === "CANCEL" || status === "FAILED" || status === "EXPIRE")
      return "Pembayaran gagal atau kadaluarsa";
    return `Status: ${status}`;
  })();

  const statusBadgeClass = (() => {
    const status = txQuery.data?.status?.toUpperCase();
    if (status === "SETTLEMENT" || status === "SUCCESS")
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/50";
    if (status === "PENDING")
      return "bg-amber-500/20 text-amber-200 border-amber-400/50";
    if (status === "CANCEL" || status === "FAILED" || status === "EXPIRE")
      return "bg-red-500/20 text-red-200 border-red-400/50";
    return "bg-slate-700/50 text-slate-200 border-slate-500/60";
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950">
        <header className="max-w-3xl mx-auto flex items-center justify-between px-6 py-6">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            WHASTORE
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
          >
            Kembali ke beranda
          </Link>
        </header>
      </div>

      <main className="max-w-3xl mx-auto px-6 pb-14">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.45)] space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
              Status Pembayaran
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mt-2">
              Konfirmasi Pesanan
            </h1>
            <p className="text-slate-300 mt-2">
              Halaman ini akan otomatis memperbarui status pembayaran Anda.
            </p>
          </div>

          {!orderId && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
              Parameter <code>order_id</code> tidak ditemukan.
            </div>
          )}

          {orderId && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Order ID</p>
                    <p className="text-lg font-semibold text-slate-100">
                      {orderId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full border text-sm font-semibold ${statusBadgeClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Total</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {txQuery.data
                      ? formatCurrency(txQuery.data.total_amount)
                      : "-"}
                  </span>
                </div>

                {txQuery.isLoading && (
                  <p className="text-sm text-slate-400">Memuat status...</p>
                )}
                {txQuery.isError && (
                  <p className="text-sm text-red-200">
                    Gagal mengambil status transaksi. Coba muat ulang.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 text-center rounded-xl bg-emerald-500 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition"
                >
                  Kembali ke beranda
                </Link>
                <button
                  onClick={() => txQuery.refetch()}
                  className="px-4 py-3 rounded-xl border border-slate-800 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
                >
                  Muat ulang
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
