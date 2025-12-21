import Image from "next/image";
import Link from "next/link";

export default function GameCard({ game }: any) {
  return (
    <Link href={`/games/${game.code}`}>
      <div className="rounded-xl shadow hover:shadow-lg p-4">
        <div className="relative w-full h-40">
          <Image
            src={game.image_url}
            alt={game.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <p className="mt-3 text-center font-semibold">{game.name}</p>
      </div>
    </Link>
  );
}
