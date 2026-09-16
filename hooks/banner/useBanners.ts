import { useQuery } from "@tanstack/react-query";
import { BannerService } from "@/api/services/bannerService"; 
import { BannerResponse } from "@/types/bannerType";

export const useBanners = () => {
  const queryInfo = useQuery<BannerResponse, Error>({
    queryKey: ["banners"],
    queryFn: () => BannerService.getBanners(),
    staleTime: 1000 * 60 * 10, // Cache banners for 10 minutes
  });

  return {
    banners: queryInfo.data?.data ?? [],
    isLoading: queryInfo.isLoading,
    isError: queryInfo.isError,
    error: queryInfo.error?.message || null,
    refetch: queryInfo.refetch,
  };
};