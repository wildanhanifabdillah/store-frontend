import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-emerald-300 hover:text-emerald-200 transition"
          >
            ← Kembali ke dashboard
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,1)]">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold">Hubungi WHASTORE</h1>
          <p className="mt-4 text-slate-300">
            Punya pertanyaan soal pesanan atau butuh bantuan lain? Silakan hubungi
            kami lewat WhatsApp.
          </p>
          <a
            href="https://wa.me/6281327653576"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:translate-y-px transition"
          >
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
