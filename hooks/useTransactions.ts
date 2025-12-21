import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { TransactionSchema, Transaction } from "@/schemas/transaction.schema";

export function useTransaction(orderId: string) {
  return useQuery<Transaction>({
    queryKey: ["transaction", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const res = await api.get(`/transactions/${orderId}`);
      return TransactionSchema.parse(res.data);
    },
  });
}
