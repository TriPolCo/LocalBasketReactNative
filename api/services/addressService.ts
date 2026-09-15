// api/services/addressService.ts
import privateApiClient from "../handler/privateClient";
import { addressEndpoints } from "../endpoints/addressEndpoints";
import { ApiResponse, Address, AddressPayload } from "@/types/addressTypes";

export class AddressService {
  static async getAddresses(): Promise<ApiResponse<Address[]>> {
    const response = await privateApiClient.get<ApiResponse<Address[]>>(
      addressEndpoints.getAddresses
    );
    return response.data;
  }

  static async getAddress(addressId: string): Promise<ApiResponse<Address>> {
    const response = await privateApiClient.get<ApiResponse<Address>>(
      addressEndpoints.getAddress(addressId)
    );
    return response.data;
  }

  static async createAddress(payload: AddressPayload): Promise<ApiResponse<Address>> {
    const response = await privateApiClient.post<ApiResponse<Address>>(
      addressEndpoints.create,
      payload
    );
    return response.data;
  }

  static async updateAddress({
    addressId,
    payload,
  }: {
    addressId: string;
    payload: AddressPayload;
  }): Promise<ApiResponse<Address>> {
    const response = await privateApiClient.patch<ApiResponse<Address>>(
      addressEndpoints.update(addressId),
      payload
    );
    return response.data;
  }

  static async setDefaultAddress(addressId: string): Promise<ApiResponse<Address>> {
    const response = await privateApiClient.patch<ApiResponse<Address>>(
      addressEndpoints.setDefault(addressId)
    );
    return response.data;
  }

  static async deleteAddress(addressId: string): Promise<ApiResponse<null>> {
    const response = await privateApiClient.delete<ApiResponse<null>>(
      addressEndpoints.delete(addressId)
    );
    return response.data;
  }
}