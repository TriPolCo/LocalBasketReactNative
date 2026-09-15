import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (isMounted) {
          setIsAuthenticated(!!token);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthToken();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isAuthenticated, isLoading };
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace("/(auth)/login" as any);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}