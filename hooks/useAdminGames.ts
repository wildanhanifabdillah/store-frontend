import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  GamesResponseSchema,
  Game,
  CreateGamePayload,
  UpdateGamePayload,
} from "@/schemas/game.schema";

export function useAdminGames() {
  const queryClient = useQueryClient();

  // 1️⃣ GET ALL GAMES (ADMIN)
  const gamesQuery = useQuery<Game[]>({
    queryKey: ["admin-games"],
    queryFn: async () => {
      const res = await api.get("/admin/games");
      return GamesResponseSchema.parse(res.data);
    },
  });

  // 2️⃣ CREATE GAME
  const createGame = useMutation({
    mutationFn: async (payload: CreateGamePayload) => {
      const res = await api.post("/admin/games", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
    },
  });

  // 3️⃣ UPDATE GAME
  const updateGame = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateGamePayload;
    }) => {
      const res = await api.put(`/admin/games/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
    },
  });

  // 4️⃣ DELETE / INACTIVE GAME
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
    // query
    gamesQuery,

    // mutations
    createGame,
    updateGame,
    deleteGame,
  };
}
