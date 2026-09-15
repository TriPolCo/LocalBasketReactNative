import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function MembershipBanner() {
  return (
    <View className="bg-emerald-900 p-4 rounded-md mb-3 flex-row items-center justify-between shadow-xs">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-md bg-amber-400/20 items-center justify-center mr-3">
          <Ionicons name="ribbon" size={22} color="#FBBF24" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-extrabold text-white">DailyDrop Plus</Text>
          <Text className="text-[11px] text-emerald-200 mt-0.5">Get exclusive offers, free delivery & more!</Text>
        </View>
      </View>
      <TouchableOpacity className="bg-white px-3.5 py-2 rounded-md shadow-xs">
        <Text className="text-xs font-bold text-emerald-900">Explore</Text>
      </TouchableOpacity>
    </View>
  );
}