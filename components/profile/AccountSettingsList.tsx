import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AccountSettingsList({ onLogout }: { onLogout: () => void }) {
  const settingsItems = [
    { title: "Profile Information", subtitle: "Edit your personal details", icon: "person-outline", bg: "bg-blue-50", color: "#3B82F6" },
    { title: "Payment Histrory", subtitle: "See your payment history", icon: "card-outline", bg: "bg-pink-50", color: "#EC4899" },
    { title: "Notifications", subtitle: "Manage your preferences", icon: "notifications-outline", bg: "bg-amber-50", color: "#F59E0B" },
    { title: "Privacy & Security", subtitle: "Password, security and data", icon: "shield-checkmark-outline", bg: "bg-purple-50", color: "#8B5CF6" },
    { title: "Help & Support", subtitle: "Get help, contact us", icon: "help-circle-outline", bg: "bg-emerald-50", color: "#10B981" },
    { title: "About DailyDrop", subtitle: "App version, terms & policies", icon: "information-circle-outline", bg: "bg-slate-100", color: "#64748B" },
  ];

  return (
    <View className="bg-white rounded-md p-2 shadow-xs mb-4 border border-slate-100">
      <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">Account Settings</Text>
      {settingsItems.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          className="flex-row items-center justify-between p-3 border-b border-slate-50 last:border-0"
        >
          <View className="flex-row items-center flex-1">
            <View className={`w-9 h-9 rounded-xl ${item.bg} items-center justify-center mr-3`}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-800">{item.title}</Text>
              <Text className="text-[11px] text-slate-400">{item.subtitle}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={onLogout}
        className="mt-2 flex-row items-center justify-center p-3.5 bg-red-50 rounded-md border border-red-100"
      >
        <Ionicons name="log-out-outline" size={18} color="#DC2626" />
        <Text className="text-sm font-bold text-red-600 ml-2">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}