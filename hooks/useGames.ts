import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { GamesResponseSchema, Game } from "@/schemas/game.schema";

export function useGames() {
  return useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => {
      const res = await api.get("/games");
      return GamesResponseSchema.parse(res.data);
    },
  });
}
