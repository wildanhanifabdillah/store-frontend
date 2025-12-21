import Link from "next/link";
import GameGrid from "@/components/user/GameGrid";
import Footer from "@/components/user/Footer";

export default function HomePage() {
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
              className="rounded-full bg-emerald-500 text-slate-950 px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/30"
            >
              Game
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-300 transition"
            >
              Contact
            </Link>
          </nav>
        </header>

        <section className="max-w-6xl mx-auto px-6 pb-14">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(16,185,129,0.55)]">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
              Temukan top-up game favorit dengan tampilan simpel dan elegan.
            </h1>
            <p className="mt-4 text-slate-300 md:w-2/3">
              Jelajahi katalog game WHASTORE, pilih paket, dan lanjutkan checkout
              tanpa ribet.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/50 shadow-emerald-500/20 shadow-lg" />
              <span className="text-sm text-emerald-200">
                Koleksi terus diperbarui.
              </span>
            </div>
          </div>
        </section>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-12 -mt-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-[0_30px_70px_-45px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                Koleksi
              </p>
              <h2 className="text-2xl font-semibold">Daftar Game</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" />
              Aktif & Siap top-up
            </div>
          </div>
          <GameGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
