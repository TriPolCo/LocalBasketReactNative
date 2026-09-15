// app/_layout.tsx
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="address" />
        <Stack.Screen name="product" />
        <Stack.Screen name="cart" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Modal",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}