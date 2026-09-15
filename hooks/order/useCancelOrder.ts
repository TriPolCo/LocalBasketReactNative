import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/api/services/orderService";
import { ORDERS_QUERY_KEY } from "./useOrders";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => OrderService.cancelOrder(orderId),
    onSuccess: () => {
      queueMicrotask(() => {
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      });
    },
  });
};