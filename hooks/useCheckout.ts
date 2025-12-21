import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { CheckoutPayload } from "@/schemas/checkout.schema";

export function useCheckout() {
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const res = await api.post("/checkout", payload);
      return res.data; // berisi redirect_url Midtrans
    },
  });
}
