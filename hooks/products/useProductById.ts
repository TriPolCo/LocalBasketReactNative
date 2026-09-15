import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ProductService } from "@/api/services/productService";
import { ApiResponse, ProductResponse } from "@/types/productTypes";

export const useProductById = (
  productId: string
): UseQueryResult<ApiResponse<ProductResponse>, Error> => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductService.getProductById(productId),
    enabled: !!productId,
  });
};