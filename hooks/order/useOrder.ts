import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/api/services/orderService";
import { ORDERS_QUERY_KEY } from "./useOrders";

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, orderId],
    queryFn: () => OrderService.getOrderById(orderId),
    enabled: !!orderId,
  });
};