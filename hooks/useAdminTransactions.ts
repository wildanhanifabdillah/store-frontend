import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  AdminTransactionsResponseSchema,
  AdminTransaction,
} from "@/schemas/transaction.schema";

export function useAdminTransactions(status?: string) {
  return useQuery<AdminTransaction[]>({
    queryKey: ["admin-transactions", status || ""],
    queryFn: async () => {
      const res = await api.get("/admin/transactions", {
        params: status ? { status } : {},
      });
      return AdminTransactionsResponseSchema.parse(res.data);
    },
  });
}
