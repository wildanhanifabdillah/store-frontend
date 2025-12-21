import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.number(),
  order_id: z.string(),
  status: z.string(),
  amount: z.number(),
  payment_method: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
