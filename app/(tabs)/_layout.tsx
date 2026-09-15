import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#047857",
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          elevation: 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="vegetables"
        options={{
          title: "Vegetables",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="groceries"
        options={{
          title: "Groceries",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "basket" : "basket-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="food"
        options={{
          title: "Food",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: async (e) => {
            const token = await SecureStore.getItemAsync("access_token");
            if (!token) {
              e.preventDefault();
              router.push("/(auth)/login");
            }
          },
        }}
      />
    </Tabs>
  );
}