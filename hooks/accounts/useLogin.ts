import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { AccountService } from "@/api/services/accountService"; 
import { LoginPayload } from "@/types/accountsTypes";
export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AccountService.login(payload);
      
      if (response.success && response.data?.tokens) {
        await SecureStore.setItemAsync("access_token", response.data.tokens.access);
        await SecureStore.setItemAsync("refresh_token", response.data.tokens.refresh);
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}