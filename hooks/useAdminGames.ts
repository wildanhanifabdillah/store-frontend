import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { GamesResponseSchema, Game, CreateGamePayload } from "@/schemas/game.schema";

type UpdateGamePayload = {
  id: number;
  name?: string;
  code?: string;
  image?: File | null;
  is_active?: boolean;
};

export function useAdminGames() {
  const queryClient = useQueryClient();

  // GET games (admin, termasuk yang non-aktif)
  const gamesQuery = useQuery<Game[]>({
    queryKey: ["admin-games"],
    queryFn: async () => {
      const res = await api.get("/admin/games");
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
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
    },
  });

  const updateGame = useMutation({
    mutationFn: async ({ id, name, code, image, is_active }: UpdateGamePayload) => {
      const formData = new FormData();
      if (name !== undefined) formData.append("name", name);
      if (code !== undefined) formData.append("code", code);
      if (is_active !== undefined) formData.append("is_active", String(is_active));
      if (image) formData.append("image", image);

      const res = await api.put(`/admin/games/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
    },
  });

  const deleteGame = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/admin/games/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
    },
  });

  return {
    gamesQuery,
    createGame,
    updateGame,
    deleteGame,
  };
}
