"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminGames } from "@/hooks/useAdminGames";
import { clearAdminToken, getAdminToken } from "@/lib/auth";

export default function AdminGamesPage() {
  const router = useRouter();
  const { gamesQuery, createGame, updateGame, deleteGame } = useAdminGames();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Guard: redirect ke login jika tidak ada token
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!imageFile) {
      setError("Gambar wajib diunggah");
      return;
    }
    try {
      await createGame.mutateAsync({
        name,
        code,
        image: imageFile,
      });
      setName("");
      setCode("");
      setImageFile(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Gagal menambahkan game";
      setError(msg);
    }
  };

  const games = useMemo(() => gamesQuery.data || [], [gamesQuery.data]);

  const startEdit = (game: any) => {
    setEditingId(game.id);
    setEditName(game.name);
    setEditCode(game.code);
    setEditActive(game.is_active);
    setEditImage(null);
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setEditError(null);
    try {
      await updateGame.mutateAsync({
        id: editingId,
        name: editName,
        code: editCode,
        is_active: editActive,
        image: editImage ?? undefined,
      });
      setEditingId(null);
      setEditImage(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Gagal memperbarui game";
      setEditError(msg);
    }
  };

  const handleDelete = (id: number) => {
    deleteGame.mutate(id);
    if (editingId === id) setEditingId(null);
  };

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin - Games</h1>
          <p className="text-slate-400 text-sm">Kelola katalog game</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
          >
            Lihat toko
          </button>
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
          <h2 className="text-lg font-semibold mb-4">Tambah Game</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                placeholder="Mobile Legends"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Kode</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none uppercase"
                placeholder="ml"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-slate-950 file:font-semibold file:cursor-pointer"
                required
              />
            </div>
            <div className="md:col-span-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={createGame.isPending}
                className="rounded-xl bg-emerald-500 text-slate-950 font-semibold px-4 py-2 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition disabled:opacity-60"
              >
                {createGame.isPending ? "Menyimpan..." : "Tambah"}
              </button>
              {error && <span className="text-sm text-red-300">{error}</span>}
              {createGame.isSuccess && !error && (
                <span className="text-sm text-emerald-300">Berhasil menambahkan</span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Daftar</p>
              <h2 className="text-lg font-semibold">Games</h2>
            </div>
          </div>

          {gamesQuery.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-48 rounded-xl bg-slate-800/40 animate-pulse" />
              ))}
            </div>
          )}

          {gamesQuery.isError && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
              Gagal memuat games.
            </div>
          )}

          {!gamesQuery.isLoading && games.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-300">
              Belum ada game.
            </div>
          )}

          {!gamesQuery.isLoading && games.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                >
                  {game.image_url && (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border border-slate-800">
                      <Image
                        src={game.image_url}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="(min-width:768px) 33vw, 100vw"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{game.name}</p>
                    <p className="text-sm text-slate-400">Code: {game.code}</p>
                    <p className="text-xs text-slate-400">
                      Status:{" "}
                      <span className={game.is_active ? "text-emerald-300" : "text-amber-300"}>
                        {game.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/admin/games/${game.id}/packages`}
                    className="inline-block text-sm text-emerald-300 hover:underline"
                  >
                    Kelola paket
                  </Link>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => startEdit(game)}
                      className="text-emerald-300 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="text-red-300 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {editingId && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Edit Game</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleUpdate}>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nama</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Kode</label>
                <input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Gambar (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-slate-950 file:font-semibold file:cursor-pointer"
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Aktif
                </label>
                <button
                  type="submit"
                  disabled={updateGame.isPending}
                  className="rounded-xl bg-emerald-500 text-slate-950 font-semibold px-4 py-2 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition disabled:opacity-60"
                >
                  {updateGame.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-xl border border-slate-800 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
                >
                  Batal
                </button>
                {editError && <span className="text-sm text-red-300">{editError}</span>}
                {updateGame.isSuccess && !editError && (
                  <span className="text-sm text-emerald-300">Berhasil diperbarui</span>
                )}
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
