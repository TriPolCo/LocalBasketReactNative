import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";
import { ADDRESS_QUERY_KEY } from "./useAddresses";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => AddressService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
    },
  });
};