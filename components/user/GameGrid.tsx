"use client";

import GameCard from "@/components/user/GameCard";
import { useGames } from "@/hooks/useGames";

export default function GameGrid() {
  const { data, isLoading, isError } = useGames();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-52 rounded-2xl bg-slate-800/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-100 px-4 py-3">
        Gagal memuat game. Coba muat ulang halaman.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-200">
        Belum ada game tersedia.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
