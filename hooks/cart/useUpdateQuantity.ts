// hooks/useUpdateQuantity.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/api/services/cartService";
import { UpdateQuantityPayload } from "@/types/cartTypes";
import { CART_QUERY_KEY } from "./useCart";

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateQuantityPayload }) =>
      CartService.updateQuantity(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};