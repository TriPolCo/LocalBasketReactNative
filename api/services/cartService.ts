import privateApiClient from "../handler/privateClient";
import { cartEndpoints } from "../endpoints/cartEndpoints";
import {
  ApiResponse,
  CartData,
  AddToCartPayload,
  UpdateQuantityPayload,
} from "@/types/cartTypes";

export class CartService {
  static async getCart(): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.get<ApiResponse<CartData>>(
        cartEndpoints.getCart
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async addToCart(
    payload: AddToCartPayload
  ): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.post<ApiResponse<CartData>>(
        cartEndpoints.add,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateQuantity(
    itemId: string,
    payload: UpdateQuantityPayload
  ): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.patch<ApiResponse<CartData>>(
        cartEndpoints.updateQuantity(itemId),
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async increaseQuantity(
    itemId: string
  ): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.post<ApiResponse<CartData>>(
        cartEndpoints.increaseQuantity(itemId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async decreaseQuantity(
    itemId: string
  ): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.post<ApiResponse<CartData>>(
        cartEndpoints.decreaseQuantity(itemId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async removeItem(itemId: string): Promise<ApiResponse<CartData>> {
    try {
      const response = await privateApiClient.delete<ApiResponse<CartData>>(
        cartEndpoints.removeItem(itemId)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async clearCart(): Promise<ApiResponse<null>> {
    try {
      const response = await privateApiClient.delete<ApiResponse<null>>(
        cartEndpoints.clear
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}