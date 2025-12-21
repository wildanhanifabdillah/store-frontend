"use client";

import { Suspense } from "react";
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

function CheckoutRedirectContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");

  const txQuery = useQuery<TransactionStatus>({
    queryKey: ["transaction-status", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const res = await api.get(`/transactions/${orderId}`);
      return res.data as TransactionStatus;
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.status.toUpperCase() === "PENDING" ? 4000 : false;
    },
    retry: 1,
  });

  const statusLabel = (() => {
    const status = txQuery.data?.status?.toUpperCase();
    if (!status) return "Menunggu status...";
    if (status === "PENDING") return "Menunggu pembayaran...";
    if (status === "SETTLEMENT" || status === "SUCCESS")
      return "Pembayaran berhasil";
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

  if (!orderId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-8 space-y-3 text-center">
          <h1 className="text-2xl font-semibold">Order ID tidak ditemukan</h1>
          <p className="text-slate-300 text-sm">
            Pastikan kamu membuka link pembayaran yang benar atau ulangi proses checkout.
          </p>
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl bg-emerald-500 text-slate-950 font-semibold px-4 py-2 shadow-lg shadow-emerald-500/25 hover:translate-y-px transition"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = txQuery.isLoading || txQuery.isFetching;
  const status = txQuery.data?.status?.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Status Pembayaran
          </p>
          <h1 className="text-3xl font-bold leading-tight">Order #{orderId}</h1>
          <p className="text-slate-300">
            Pantau status transaksi kamu. Halaman ini akan memperbarui status otomatis selama pembayaran masih pending.
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
        {txQuery.isError && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
            Gagal memuat status transaksi. Coba muat ulang atau periksa koneksi internet.
          </div>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadgeClass}`}
              >
                {status ?? "MENUNGGU"}
              </span>
              <p className="text-sm text-slate-300">{statusLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => txQuery.refetch()}
                disabled={isLoading}
                className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition disabled:opacity-60"
              >
                {isLoading ? "Memeriksa..." : "Muat ulang"}
              </button>
              <Link
                href="/"
                className="rounded-xl bg-emerald-500 text-slate-950 font-semibold px-3 py-2 text-sm shadow-lg shadow-emerald-500/20 hover:translate-y-px transition"
              >
                Kembali ke beranda
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Order ID</span>
              <span className="font-mono text-slate-100">{orderId}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Total Pembayaran</span>
              <span className="text-lg font-bold text-emerald-300">
                {txQuery.data ? formatCurrency(txQuery.data.total_amount) : "Memuat..."}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Status</span>
              <span className="font-semibold text-slate-100">
                {status ?? (isLoading ? "Memeriksa..." : "Tidak diketahui")}
              </span>
            </div>
          </div>

          {isLoading && (
            <div className="h-24 rounded-xl border border-slate-800 bg-slate-800/40 animate-pulse" />
          )}

          {!isLoading && txQuery.data && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 text-sm text-slate-300">
              <p>
                Jika status sudah{" "}
                <span className="font-semibold text-emerald-300">SUCCESS</span>,
                pesanan akan diproses otomatis. Jika masih PENDING, kamu bisa menunggu beberapa detik atau klik muat ulang.
              </p>
              <p>
                Butuh bantuan? Hubungi tim support dengan menyertakan Order ID di atas.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function CheckoutRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-sm text-slate-300">
            Memuat status transaksi...
          </div>
        </div>
      }
    >
      <CheckoutRedirectContent />
    </Suspense>
  );
}
