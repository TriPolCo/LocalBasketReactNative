import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";
import { ADDRESS_QUERY_KEY } from "./useAddresses";
import { AddressPayload } from "@/types/addressTypes";

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, payload }: { addressId: string; payload: AddressPayload }) =>
      AddressService.updateAddress({ addressId, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["address", variables.addressId] });
    },
  });
};