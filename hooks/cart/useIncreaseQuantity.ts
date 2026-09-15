import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/api/services/cartService";
import { CART_QUERY_KEY } from "./useCart";

export const useIncreaseQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => CartService.increaseQuantity(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};