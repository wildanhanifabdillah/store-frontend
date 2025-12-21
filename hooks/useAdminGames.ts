import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { GamesResponseSchema, Game, CreateGamePayload } from "@/schemas/game.schema";

export function useAdminGames() {
  const queryClient = useQueryClient();

  // GET games (pakai endpoint publik karena backend belum sediakan /admin/games GET)
  const gamesQuery = useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => {
      const res = await api.get("/games");
      return GamesResponseSchema.parse(res.data);
    },
  });

  // CREATE game (backend minta multipart: name, code, image)
  const createGame = useMutation({
    mutationFn: async ({ name, code, image }: CreateGamePayload) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("code", code);
      formData.append("image", image);

      const res = await api.post("/admin/games", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  return {
    gamesQuery,
    createGame,
  };
}
