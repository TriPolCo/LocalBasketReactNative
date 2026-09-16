import apiClient from "../handler/apiClient";
import { searchEndpoints } from "../endpoints/searchEndpoints";
import { ProductSearchResponse } from "@/types/productSearchType";

export class SearchService {
  static async searchProducts(query: string): Promise<ProductSearchResponse> {
    try {
      const response = await apiClient.get<ProductSearchResponse>(
        searchEndpoints.searchProducts, 
        {
          params: { search: query },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}