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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* UI tetap, tidak diubah */}
    </div>
  );
}
