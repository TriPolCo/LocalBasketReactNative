import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const quickCategories = [
  { icon: "leaf-outline", title: "Vegetables", route: "/vegetables" },
  { icon: "basket-outline", title: "Grocery", route: "/groceries" },
  { icon: "restaurant-outline", title: "Food", route: "/food" },
  { icon: "grid-outline", title: "More", route: "/categories" },
];

interface QuickCategoriesProps {
  onPressRoute: (route: string) => void;
}

export function QuickCategories({ onPressRoute }: QuickCategoriesProps) {
  return (
    <View className="px-5 mt-4">
      <View className="flex-row justify-between bg-white p-2.5 rounded-md border border-[#E2E8F0] shadow-sm">
        {quickCategories.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={() => onPressRoute(item.route)}
            activeOpacity={0.8}
            className="items-center flex-1 py-1"
          >
            <View className="h-9 w-9 items-center justify-center rounded-md bg-emerald-50 border border-emerald-100">
              <Ionicons name={item.icon as any} size={18} color="#047857" />
            </View>
            <Text className="mt-1 text-[11px] font-bold text-[#0F172A]" numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}