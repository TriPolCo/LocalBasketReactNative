// hooks/order/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/api/services/orderService";

export const ORDERS_QUERY_KEY = ["orders"];

export const useOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: OrderService.getOrders,
  });
};