import apiClient from "../handler/apiClient";
import { bannerEndpoints } from "../endpoints/bannerEndpoints";
import { BannerResponse } from "@/types/bannerType";

export class BannerService {
  static async getBanners(): Promise<BannerResponse> {
    try {
      const response = await apiClient.get<BannerResponse>(
        bannerEndpoints.getBanners
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}