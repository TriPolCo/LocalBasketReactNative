import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/api/services/cartService";
import { CART_QUERY_KEY } from "./useCart"; 

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};