import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { GamePackage, PackagesResponseSchema } from "@/schemas/package.schema";

type CreatePayload = {
  name: string;
  amount: number;
  price: number;
  is_active?: boolean;
};

type UpdatePayload = {
  id: number;
  name?: string;
  amount?: number;
  price?: number;
  is_active?: boolean;
};

export function useAdminPackages(gameId: number) {
  const queryClient = useQueryClient();

  const packagesQuery = useQuery<GamePackage[]>({
    queryKey: ["admin-packages", gameId],
    enabled: !!gameId,
    queryFn: async () => {
      const res = await api.get(`/admin/games/${gameId}/packages`);
      return PackagesResponseSchema.parse(res.data);
    },
  });

  const createPackage = useMutation({
    mutationFn: async (payload: CreatePayload) => {
      const res = await api.post(`/admin/games/${gameId}/packages`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages", gameId] });
    },
  });

  const updatePackage = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const res = await api.put(`/admin/packages/${payload.id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages", gameId] });
    },
  });

  const deletePackage = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/admin/packages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages", gameId] });
    },
  });

  return {
    packagesQuery,
    createPackage,
    updatePackage,
    deletePackage,
  };
}
