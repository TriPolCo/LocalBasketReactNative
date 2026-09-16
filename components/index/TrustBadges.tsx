import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const trustBadges = [
  { icon: "bicycle-outline", title: "Free Delivery", subtitle: "On orders ₹199+" },
  { icon: "shield-checkmark-outline", title: "Secure Payments", subtitle: "100% protected" },
];

export function TrustBadges() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {trustBadges.map((badge) => (
        <View
          key={badge.title}
          className="mb-3 w-[48%] rounded-md bg-white p-3.5 border border-[#E2E8F0] shadow-sm"
        >
          <View className="h-9 w-9 items-center justify-center rounded-md bg-[#FFEDD5] border border-orange-100">
            <Ionicons name={badge.icon as any} size={18} color="#EA580C" />
          </View>
          <Text className="mt-2.5 text-xs font-bold text-[#0F172A]">{badge.title}</Text>
          <Text className="mt-0.5 text-[11px] text-[#64748B] leading-4">{badge.subtitle}</Text>
        </View>
      ))}
    </View>
  );
}