import { z } from "zod";

// Bentuk data mentah dari backend (PascalCase)
const PackageApiSchema = z.object({
  ID: z.number(),
  GameID: z.number(),
  Name: z.string(),
  Amount: z.number(),
  Price: z.number(),
  IsActive: z.boolean(),
});

export type GamePackage = {
  id: number;
  game_id: number;
  name: string;
  amount: number;
  price: number;
  is_active: boolean;
};

export const PackagesResponseSchema = z
  .object({
    data: z.array(PackageApiSchema),
  })
  .transform(({ data }) =>
    data.map((pkg) => ({
      id: pkg.ID,
      game_id: pkg.GameID,
      name: pkg.Name,
      amount: pkg.Amount,
      price: pkg.Price,
      is_active: pkg.IsActive,
    }))
  );
