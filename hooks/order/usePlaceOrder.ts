import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/api/services/orderService";
import { PlaceOrderPayload } from "@/types/orderTypes";
import { ORDERS_QUERY_KEY } from "./useOrders";
import { CART_QUERY_KEY } from "../cart/useCart";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) =>
      OrderService.placeOrder(payload),

    onSuccess: () => {
      queueMicrotask(() => {
        // Refresh orders
        queryClient.invalidateQueries({
          queryKey: ORDERS_QUERY_KEY,
        });

        // Refresh cart
        queryClient.invalidateQueries({
          queryKey: CART_QUERY_KEY,
        });
      });
    },
  });
};