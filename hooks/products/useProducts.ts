
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ProductService } from "../../api/services/productService";
import {
  ApiResponse,
  ProductResponse,
} from "../../types/productTypes";

export const useProducts = (
  categorySlug?: string
): UseQueryResult<ApiResponse<ProductResponse[]>, Error> => {
  return useQuery({
    queryKey: ["products", categorySlug],
    queryFn: () => ProductService.getProducts(categorySlug),
  });
};
