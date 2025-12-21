export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-slate-300">
      <div className="space-y-2">
        <p className="font-semibold text-slate-100">@whastore</p>
        <a
          href="https://wa.me/6281327653576"
          className="inline-flex items-center justify-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition"
          target="_blank"
          rel="noreferrer"
        >
          Butuh bantuan?
        </a>
      </div>
    </footer>
  );
}
