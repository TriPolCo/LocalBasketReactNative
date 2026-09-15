import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://10.82.158.135:8000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("➡️ API Request:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API Response:", {
      status: response.status,
      url: response.config.url,
    });

    return response;
  },
  (error: any) => {
    console.error("❌ API Error:", {
      message: error?.message,
      url: error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    return Promise.reject(error);
  }
);

export default apiClient;