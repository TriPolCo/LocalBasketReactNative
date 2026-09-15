import { useQuery } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";
import { Address, ApiResponse } from "@/types/addressTypes";

export const useAddressById = (addressId: string) => {
  return useQuery<ApiResponse<Address>, Error, Address>({
    queryKey: ["address", addressId],
    queryFn: () => AddressService.getAddress(addressId),
    enabled: !!addressId,
    select: (response) => response.data,
  });
};