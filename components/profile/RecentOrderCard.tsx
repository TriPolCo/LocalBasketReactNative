import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function RecentOrderCard() {
  return (
    <View className="bg-white p-4 rounded-md shadow-xs mb-4 border border-slate-100">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Order</Text>
        <TouchableOpacity>
          <Text className="text-xs font-extrabold text-emerald-700">View All</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: "https://res.cloudinary.com/dup5b38zp/image/upload/v1788654799/kunduru_uzbvga.jpg" }}
            className="w-12 h-12 rounded-md bg-slate-100"
          />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>Fresh Vegetables Combo</Text>
            <Text className="text-xs text-slate-500 mt-0.5">5 items • Delivered on 2 Sep 2026</Text>
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5" />
              <Text className="text-[11px] font-bold text-emerald-700">Delivered</Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </View>
    </View>
  );
}