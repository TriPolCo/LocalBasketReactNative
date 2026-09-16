import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { SearchService } from '@/api/services/searchService'; 
import { ProductSearchResponse } from '@/types/productSearchType';

export const useProductSearch = (delay: number = 400) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  const queryInfo = useQuery<ProductSearchResponse, Error>({
    queryKey: ['productsSearch', debouncedQuery],
    queryFn: () => SearchService.searchProducts(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: keepPreviousData, // Keeps old search results visible smoothly while fetching new ones
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    searchQuery,
    setSearchQuery,
    products: queryInfo.data?.data ?? [],
    count: queryInfo.data?.count ?? 0,
    isLoading: queryInfo.isLoading,
    isFetching: queryInfo.isFetching,
    error: queryInfo.error?.message || null,
  };
};