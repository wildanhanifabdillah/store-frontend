"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Footer from "@/components/user/Footer";
import { useGames } from "@/hooks/useGames";
import { useGamePackages } from "@/hooks/useGamePackages";
import { useCheckout } from "@/hooks/useCheckout";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function GameDetailPage() {
  const params = useParams<{ id: string }>();
  const gameId = Number(params?.id ?? 0);
  const { data: games } = useGames();
  const game = games?.find((g) => g.id === gameId);

  const {
    data: packages,
    isLoading: packagesLoading,
    isError: packagesError,
  } = useGamePackages(gameId);

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const checkout = useCheckout();

  const selectedPackage = useMemo(
    () => packages?.find((p) => p.id === selectedPackageId) || null,
    [packages, selectedPackageId]
  );

  const canBuy =
    !!gameId && !!selectedPackageId && userId.trim() !== "" && email.trim() !== "";

  const handleCheckout = async () => {
    if (!canBuy || !selectedPackageId) return;
    try {
      const res = await checkout.mutateAsync({
        game_id: gameId,
        package_id: selectedPackageId,
        game_user_id: userId,
        email,
      });

      const redirectUrl = res?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (_) {
      // error ditangani melalui state di bawah
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-950">
        <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            WHASTORE
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
            >
              Game
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-emerald-500 text-slate-950 px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/30"
            >
              Contact
            </Link>
          </nav>
        </header>

        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.55)] flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                Pilih Paket
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {game?.name ?? "Memuat game..."}
              </h1>
              <p className="text-slate-300">
                Masukkan data akun, pilih nominal topup, dan lanjutkan pembayaran.
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" />
                Pesanan diproses otomatis setelah pembayaran berhasil.
              </div>
            </div>
            {game?.image_url && (
              <div className="relative h-32 w-full md:w-56 overflow-hidden rounded-2xl border border-slate-800">
                <Image
                  src={game.image_url}
                  alt={game.name}
                  fill
                  className="object-cover brightness-100"
                  sizes="(min-width:768px) 224px, 100vw"
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-14 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h2 className="text-xl font-semibold">Masukkan informasi akun</h2>
              <label className="block text-sm text-slate-300">
                User ID (server)
              </label>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="contoh: 12345678(1234)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
              />
              <p className="text-xs text-slate-400">
                Pastikan format User ID sesuai instruksi dalam game.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                    Paket
                  </p>
                  <h2 className="text-xl font-semibold">Pilih nominal topup</h2>
                </div>
                {packagesLoading && (
                  <span className="text-xs text-slate-400">Memuat paket...</span>
                )}
              </div>

              {packagesError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
                  Gagal memuat paket. Coba muat ulang halaman.
                </div>
              )}

              {packagesLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-24 rounded-xl bg-slate-800/50 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {!packagesLoading && packages && packages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => {
                    const active = pkg.id === selectedPackageId;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`text-left rounded-xl border px-4 py-4 transition ${
                          active
                            ? "border-emerald-400 bg-emerald-500/10 shadow-[0_10px_30px_-20px_rgba(16,185,129,1)]"
                            : "border-slate-800 bg-slate-900/80 hover:border-emerald-300/60 hover:-translate-y-0.5"
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-100">
                          {pkg.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {pkg.amount} item
                        </p>
                        <p className="mt-2 text-lg font-bold text-emerald-300">
                          {formatCurrency(pkg.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {!packagesLoading && packages?.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-300">
                  Paket belum tersedia.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <h2 className="text-xl font-semibold">Konfirmasi Pembelian</h2>
              <label className="block text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alamat@email.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
              />
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Paket dipilih</span>
                  <span className="font-semibold text-slate-100">
                    {selectedPackage ? selectedPackage.name : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Total</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {selectedPackage ? formatCurrency(selectedPackage.price) : "Rp0"}
                  </span>
                </div>
              </div>
              {checkout.isError && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-100 px-3 py-2 text-sm">
                  Gagal membuat transaksi. Pastikan data sudah benar lalu coba lagi.
                </div>
              )}
              <button
                disabled={!canBuy || checkout.isPending}
                onClick={handleCheckout}
                className="w-full rounded-xl bg-emerald-500 text-slate-950 font-semibold py-3 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkout.isPending ? "Memproses..." : "Beli Sekarang"}
              </button>
              <p className="text-xs text-slate-400">
                Setelah pembayaran berhasil, Anda akan diarahkan ke halaman Midtrans
                dan email konfirmasi akan dikirim ke alamat yang Anda isi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
