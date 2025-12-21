import { z } from "zod";
import { GameApiSchema } from "@/schemas/game.schema";
import { PackageApiSchema } from "@/schemas/package.schema";

const PaymentApiSchema = z.object({
  ID: z.number().optional(),
  TransactionID: z.number().optional(),
  PaymentGateway: z.string().optional(),
  PaymentType: z.string().optional(),
  PaymentToken: z.string().optional(),
  PaymentStatus: z.string().optional(),
  RawResponse: z.string().optional(),
  CreatedAt: z.string().optional(),
  UpdatedAt: z.string().optional(),
});

const TransactionApiSchema = z.object({
  ID: z.number(),
  OrderID: z.string(),
  GameID: z.number(),
  PackageID: z.number(),
  GameUserID: z.string(),
  Email: z.string(),
  TotalAmount: z.number(),
  Status: z.string(),
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  Game: GameApiSchema.optional(),
  Package: PackageApiSchema.optional(),
  Payment: PaymentApiSchema.optional(),
});

export type AdminTransaction = {
  id: number;
  order_id: string;
  game_id: number;
  package_id: number;
  game_user_id: string;
  email: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  game?: {
    id: number;
    name: string;
    code: string;
    image_url?: string;
    is_active: boolean;
  };
  package?: {
    id: number;
    game_id: number;
    name: string;
    amount: number;
    price: number;
    is_active: boolean;
  };
  payment?: {
    gateway?: string;
    type?: string;
    status?: string;
  };
};

export const AdminTransactionsResponseSchema = z
  .object({
    data: z.array(TransactionApiSchema),
  })
  .transform(({ data }) =>
    data.map((tx) => ({
      id: tx.ID,
      order_id: tx.OrderID,
      game_id: tx.GameID,
      package_id: tx.PackageID,
      game_user_id: tx.GameUserID,
      email: tx.Email,
      total_amount: tx.TotalAmount,
      status: tx.Status,
      created_at: tx.CreatedAt,
      updated_at: tx.UpdatedAt,
      game: tx.Game
        ? {
            id: tx.Game.ID,
            name: tx.Game.Name,
            code: tx.Game.Code,
            image_url: tx.Game.image_url ?? "",
            is_active: tx.Game.IsActive,
          }
        : undefined,
      package: tx.Package
        ? {
            id: tx.Package.ID,
            game_id: tx.Package.GameID,
            name: tx.Package.Name,
            amount: tx.Package.Amount,
            price: tx.Package.Price,
            is_active: tx.Package.IsActive,
          }
        : undefined,
      payment: tx.Payment
        ? {
            gateway: tx.Payment.PaymentGateway,
            type: tx.Payment.PaymentType,
            status: tx.Payment.PaymentStatus,
          }
        : undefined,
    }))
  );

