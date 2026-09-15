import { useQuery } from "@tanstack/react-query";
import { CartService } from "@/api/services/cartService"; 
import { CartData,ApiResponse } from "@/types/cartTypes";

export const CART_QUERY_KEY = ["cart"] as const;

export const useCart = () => {
  return useQuery<ApiResponse<CartData>, Error, CartData>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => CartService.getCart(),
    select: (response) => response.data,
  });
};