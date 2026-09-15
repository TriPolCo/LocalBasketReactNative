import { useState } from "react";
import { useRouter } from "expo-router";
import { AccountService } from "@/api/services/accountService"; 
import { RegisterPayload,} from "@/types/accountsTypes";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AccountService.register(payload);
      if (response.success) {
        router.replace("/(auth)/login");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
