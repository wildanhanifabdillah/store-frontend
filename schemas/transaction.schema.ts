import { z } from "zod";

export const TransactionSchema = z.object({
  order_id: z.string(),
  status: z.string(),
  total_amount: z.number(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
