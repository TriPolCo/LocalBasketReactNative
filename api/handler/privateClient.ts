import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const authApiClient: AxiosInstance = axios.create({
  baseURL: "http://10.82.158.135:8000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

authApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Failed to retrieve access token for authClient:", error);
    }

    console.log("➡️ Authenticated API Request:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      hasAuth: !!config.headers.Authorization,
    });

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

authApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Authenticated API Response:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error: any) => {
    console.error("❌ Authenticated API Error:", {
      message: error?.message,
      url: error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return Promise.reject(error);
  }
);

export default authApiClient;