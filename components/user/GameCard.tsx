import Image from "next/image";
import Link from "next/link";
import { Game } from "@/schemas/game.schema";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.75)] hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(15,23,42,0.85)] transition-all duration-200"
    >
      <div className="relative w-full h-44 overflow-hidden rounded-xl">
        <Image
          src={game.image_url}
          alt={game.name}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw"
          className="object-cover brightness-95 transition duration-200 group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-100">
          <span className="px-2 py-1 rounded-lg bg-slate-900/70 border border-white/10">
            {game.code}
          </span>
          <span className="px-2 py-1 rounded-lg bg-emerald-500/80 text-slate-950 font-semibold">
            Aktif
          </span>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-50 text-center">
        {game.name}
      </p>
    </Link>
  );
}
