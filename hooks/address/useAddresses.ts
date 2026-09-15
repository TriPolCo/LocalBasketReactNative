import { useQuery } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";
import { Address, ApiResponse } from "@/types/addressTypes";

export const ADDRESS_QUERY_KEY = ["addresses"] as const;

export const useAddresses = () => {
  return useQuery<ApiResponse<Address[]>, Error, Address[]>({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: () => AddressService.getAddresses(),
    select: (response) => response.data,
  });
};