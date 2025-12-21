import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PackagesResponseSchema, GamePackage } from "@/schemas/package.schema";

export function useGamePackages(gameId: number) {
  return useQuery<GamePackage[]>({
    queryKey: ["packages", gameId],
    enabled: !!gameId,
    queryFn: async () => {
      const res = await api.get(`/games/${gameId}/packages`);
      return PackagesResponseSchema.parse(res.data);
    },
  });
}
