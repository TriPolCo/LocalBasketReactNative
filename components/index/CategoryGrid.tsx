import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const categories = [
  { icon: "leaf-outline", title: "Vegetables", color: "#DCFCE7" },
  { icon: "nutrition-outline", title: "Fruits", color: "#F3E8FF" },
  { icon: "basket-outline", title: "Groceries", color: "#FEF3C7" },
  { icon: "restaurant-outline", title: "Food", color: "#FFEDD5" },
  { icon: "water-outline", title: "Dairy", color: "#DBEAFE" },
  { icon: "fast-food-outline", title: "Snacks", color: "#FFE4E6" },
  { icon: "cafe-outline", title: "Beverages", color: "#FFEDD5" },
  { icon: "medkit-outline", title: "Wellness", color: "#E0F2FE" },
];

export function CategoryGrid() {
  return (
    <View className="flex-row flex-wrap justify-between">
      {categories.map((category) => (
        <TouchableOpacity
          key={category.title}
          style={{ backgroundColor: category.color }}
          activeOpacity={0.8}
          className="mb-2.5 h-24 w-[23%] items-center justify-center rounded-md border border-black/5 shadow-sm"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
            <Ionicons name={category.icon as any} size={20} color="#047857" />
          </View>
          <Text className="mt-1.5 text-center text-[11px] font-bold text-[#0F172A]" numberOfLines={1}>
            {category.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}