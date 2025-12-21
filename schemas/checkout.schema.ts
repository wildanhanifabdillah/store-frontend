import { z } from "zod";

export const CheckoutSchema = z.object({
  game_id: z.number(),
  package_id: z.number(),
  game_user_id: z.string().min(3, "User ID wajib diisi"),
  whatsapp: z.string().optional(),
});

export type CheckoutPayload = z.infer<typeof CheckoutSchema>;
