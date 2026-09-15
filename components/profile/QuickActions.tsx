import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    { title: "Orders", subtitle: "Track & manage orders", icon: "cube-outline", bg: "bg-orange-50", color: "#F97316", route: "/orders" },
    { title: "Wishlist", subtitle: "Your favorite items", icon: "heart-outline", bg: "bg-purple-50", color: "#A855F7", route: "/wishlist" },
    { title: "Cart", subtitle: "Items in your bag", icon: "cart-outline", bg: "bg-emerald-50", color: "#047857", route: "/cart", badge: 3 },
    { title: "Addresses", subtitle: "Manage saved addresses", icon: "location-outline", bg: "bg-blue-50", color: "#3B82F6", route: "/address" },
  ];

  return (
    <View className="mb-3">
      {/* Row 1 */}
      <View className="flex-row mb-3">
        {actions.slice(0, 2).map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="bg-white p-4 rounded-md flex-1 mx-1 shadow-xs border border-slate-100 justify-between"
            style={{ minHeight: 90 }}
          >
            <View className="flex-row justify-between items-start">
              <View className={`w-10 h-10 rounded-md ${item.bg} items-center justify-center`}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              {item.badge && (
                <View className="bg-emerald-700 w-5 h-5 rounded-md items-center justify-center">
                  <Text className="text-[10px] font-bold text-white">{item.badge}</Text>
                </View>
              )}
            </View>
            <View className="mt-3">
              <Text className="text-sm font-extrabold text-slate-900">{item.title}</Text>
              <Text className="text-xs text-slate-400 mt-0.5">{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 2 */}
      <View className="flex-row">
        {actions.slice(2, 4).map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="bg-white p-4 rounded-md flex-1 mx-1 shadow-xs border border-slate-100 justify-between"
            style={{ minHeight: 90 }}
          >
            <View className="flex-row justify-between items-start">
              <View className={`w-10 h-10 rounded-md ${item.bg} items-center justify-center`}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              {item.badge && (
                <View className="bg-emerald-700 w-5 h-5 rounded-md items-center justify-center">
                  <Text className="text-[10px] font-bold text-white">{item.badge}</Text>
                </View>
              )}
            </View>
            <View className="mt-3">
              <Text className="text-sm font-extrabold text-slate-900">{item.title}</Text>
              <Text className="text-xs text-slate-400 mt-0.5">{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}