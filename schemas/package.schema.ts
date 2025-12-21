import { z } from "zod";

export const PackageSchema = z.object({
  id: z.number(),
  game_id: z.number(),
  name: z.string(),
  price: z.number(),
  amount: z.number(),
  is_active: z.boolean(),
});

export const PackagesResponseSchema = z.array(PackageSchema);

export type GamePackage = z.infer<typeof PackageSchema>;
