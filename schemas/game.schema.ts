import { z } from "zod";

export const GameSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  image_url: z.string().url(),
  is_active: z.boolean(),
});

export const GamesResponseSchema = z.array(GameSchema);

export const CreateGameSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  image_url: z.string().url(),
});

export const UpdateGameSchema = CreateGameSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export type Game = z.infer<typeof GameSchema>;
export type CreateGamePayload = z.infer<typeof CreateGameSchema>;
export type UpdateGamePayload = z.infer<typeof UpdateGameSchema>;
