import { z } from "zod";

export const CheckoutSchema = z.object({
  game_id: z.number(),
  package_id: z.number(),
  game_user_id: z.string().min(3, "User ID wajib diisi"),
  email: z.string().email("Email wajib diisi"),
});

export type CheckoutPayload = z.infer<typeof CheckoutSchema>;
