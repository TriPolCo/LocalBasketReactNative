import apiClient from "../handler/apiClient";
import { productEndpoints } from "../endpoints/productEndpoints";
import {
  ApiResponse,
  ProductResponse,
  CreateProductPayload,
} from "@/types/productTypes";

export class ProductService {
  static async getProducts(
    categorySlug?: string
  ): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const response = await apiClient.get<ApiResponse<ProductResponse[]>>(
        productEndpoints.list,
        {
          params: categorySlug
            ? {
                category: categorySlug,
              }
            : undefined,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(
    productId: string
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<ProductResponse>>(
        productEndpoints.detail(productId)
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createProduct(
    payload: CreateProductPayload
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<ProductResponse>>(
        productEndpoints.create,
        payload
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}