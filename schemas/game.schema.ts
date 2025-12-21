import { z } from "zod";

// Bentuk data mentah dari backend (PascalCase + image_url snake_case)
const GameApiSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Code: z.string(),
  image_url: z.string().optional(),
  IsActive: z.boolean(),
});

// Normalisasi ke shape frontend
export type Game = {
  id: number;
  name: string;
  code: string;
  image_url: string;
  is_active: boolean;
};

export const GamesResponseSchema = z
  .object({
    data: z.array(GameApiSchema),
  })
  .transform(({ data }) =>
    data.map((game) => ({
      id: game.ID,
      name: game.Name,
      code: game.Code,
      image_url: game.image_url ?? "",
      is_active: game.IsActive,
    }))
  );

// Schema untuk form admin (sesuai backend: name + code, image lewat multipart)
export const CreateGameSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
});

export type CreateGamePayload = z.infer<typeof CreateGameSchema> & {
  image: File;
};
