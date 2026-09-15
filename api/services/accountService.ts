import apiClient from "../handler/apiClient";
import privateApiClient from "../handler/privateClient";
import { accountsEndpoints } from "../endpoints/accountEndpoints";
import type {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  LoginResponseData,
  RegisterResponseData,
  UserProfileResponse,
  UpdateProfileImagePayload,
} from "@/types/accountsTypes"

export class AccountService {
  static async register(
    payload: RegisterPayload
  ): Promise<ApiResponse<RegisterResponseData>> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponseData>>(
        accountsEndpoints.register,
        payload
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async login(
    payload: LoginPayload
  ): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponseData>>(
        accountsEndpoints.login,
        payload
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }


  static async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
      try {
        const response = await privateApiClient.get<ApiResponse<UserProfileResponse>>(
          accountsEndpoints.profile
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  
    static async updateProfileImage(
      payload: UpdateProfileImagePayload
    ): Promise<ApiResponse<UserProfileResponse>> {
      try {
        const response = await privateApiClient.patch<ApiResponse<UserProfileResponse>>(
          accountsEndpoints.updatePhoto,
          payload
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }
}