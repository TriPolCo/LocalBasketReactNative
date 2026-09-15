import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/api/services/cartService";
import { AddToCartPayload } from "@/types/cartTypes";
import { CART_QUERY_KEY } from "./useCart"; 

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => CartService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};