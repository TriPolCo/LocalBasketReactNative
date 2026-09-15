import React, { createContext, useContext, useState } from "react";
import { useRouter } from "expo-router";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = (token: string) => {
    // Save token to SecureStore/AsyncStorage here if needed
    setIsAuthenticated(true);
    router.replace("/(tabs)");
  };

  const logout = () => {
    // Clear token here
    setIsAuthenticated(false);
    router.replace("/(auth)/login");
  };

  // Helper function to check auth before running an action
  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
    } else {
      callback();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}