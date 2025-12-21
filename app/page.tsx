import GameGrid from "@/components/user/GameGrid";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pilih Game</h1>
      <GameGrid />
    </main>
  );
}
