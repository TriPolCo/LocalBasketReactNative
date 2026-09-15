import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "@/api/services/addressService";
import { ADDRESS_QUERY_KEY } from "./useAddresses";
import { AddressPayload } from "@/types/addressTypes";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) => AddressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
    },
  });
};