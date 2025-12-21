"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminPackages } from "@/hooks/useAdminPackages";
import { useGames } from "@/hooks/useGames";
import { clearAdminToken, getAdminToken } from "@/lib/auth";

export default function AdminGamePackagesPage() {
  const params = useParams<{ id: string }>();
  const gameId = Number(params?.id || 0);
  const router = useRouter();
  const { data: games } = useGames();
  const game = games?.find((g) => g.id === gameId);

  const { packagesQuery, createPackage, updatePackage, deletePackage } =
    useAdminPackages(gameId);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [price, setPrice] = useState<number | string>("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasToken =
    typeof window !== "undefined" && getAdminToken() ? true : false;

  useEffect(() => {
    if (!hasToken) {
      router.replace("/admin/login");
    }
  }, [hasToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!gameId) {
      setError("Game tidak ditemukan");
      return;
    }
    try {
      await createPackage.mutateAsync({
        name,
        amount: Number(amount),
        price: Number(price),
        is_active: isActive,
      });
      setName("");
      setAmount("");
      setPrice("");
      setIsActive(true);
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { message?: string } } };
      const msg = maybeErr.response?.data?.message || "Gagal menambahkan paket";
      setError(msg);
    }
  };

  const pkgs = useMemo(
    () => packagesQuery.data || [],
    [packagesQuery.data]
  );

  const handleToggleActive = (id: number, current: boolean) => {
    updatePackage.mutate({ id, is_active: !current });
  };

  const handleDelete = (id: number) => {
    deletePackage.mutate(id);
  };

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  if (!hasToken) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
            Admin
          </p>
          <h1 className="text-2xl font-semibold">
            Paket - {game?.name ?? "Memuat..."}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/games"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
          >
            Kembali
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
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold mb-4">Tambah Paket</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-slate-300">Nama Paket</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="86 Diamonds"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Jumlah</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="86"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Harga</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="20000"
                required
              />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4"
                />
                Aktif
              </label>
              <button
                type="submit"
                disabled={createPackage.isPending}
                className="rounded-xl bg-emerald-500 text-slate-950 font-semibold px-4 py-2 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition disabled:opacity-60"
              >
                {createPackage.isPending ? "Menyimpan..." : "Tambah"}
              </button>
              {error && <span className="text-sm text-red-300">{error}</span>}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Daftar Paket</h2>
          </div>

          {packagesQuery.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-32 rounded-xl bg-slate-800/40 animate-pulse"
                />
              ))}
            </div>
          )}

          {packagesQuery.isError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
              Gagal memuat paket.
            </div>
          )}

          {!packagesQuery.isLoading && pkgs.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-300">
              Belum ada paket.
            </div>
          )}

          {!packagesQuery.isLoading && pkgs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pkgs.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{pkg.name}</p>
                    <button
                      onClick={() => handleToggleActive(pkg.id, pkg.is_active)}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        pkg.is_active
                          ? "border-emerald-400 text-emerald-200"
                          : "border-slate-600 text-slate-300"
                      }`}
                    >
                      {pkg.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </div>
                  <p className="text-sm text-slate-300">Jumlah: {pkg.amount}</p>
                  <p className="text-sm text-slate-300">Harga: Rp{pkg.price.toLocaleString("id-ID")}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(pkg.id, pkg.is_active)}
                      className="text-sm text-amber-300 hover:underline"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-sm text-red-300 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
