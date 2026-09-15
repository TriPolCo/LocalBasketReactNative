// hooks/address/useSetDefaultAddress.ts
import { useMutation } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";

export const useSetDefaultAddress = () => {
  return useMutation({
    mutationFn: (addressId: string) => AddressService.setDefaultAddress(addressId),
  });
};