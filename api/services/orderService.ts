// api/services/orderService.ts
import privateApiClient from "../handler/privateClient";
import { orderEndpoints } from "../endpoints/orderEndpoints";
import {
  Order,
  PlaceOrderPayload,
  OrderResponse,
} from "@/types/orderTypes";

export class OrderService {
  static async getOrders(): Promise<Order[]> {
    try {
      const response = await privateApiClient.get<OrderResponse>(
        orderEndpoints.getOrders
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      throw error;
    }
  }

  static async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await privateApiClient.get<OrderResponse>(
        orderEndpoints.getOrder(orderId)
      );
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  }

  static async placeOrder(
    payload: PlaceOrderPayload
  ): Promise<Order> {
    try {
      const response = await privateApiClient.post<OrderResponse>(
        orderEndpoints.placeOrder,
        payload
      );
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  }

  static async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await privateApiClient.patch<OrderResponse>(
        orderEndpoints.cancelOrder(orderId)
      );
      return response.data.data as Order;
    } catch (error) {
      throw error;
    }
  }
}