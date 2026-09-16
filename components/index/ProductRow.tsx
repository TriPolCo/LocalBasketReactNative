import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

type Product = {
  id: string;
  name: string;
  unit: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
};

export function ProductRow({ product }: { product: Product }) {
  return (
    <View className="mb-2.5 flex-row items-center rounded-md bg-white p-2.5 border border-[#E2E8F0] shadow-sm">
      <ImageBackground
        source={{ uri: product.image }}
        className="h-14 w-14 overflow-hidden rounded-md bg-[#F8FAFC] border border-[#E2E8F0]"
        imageStyle={{ borderRadius: 6 }}
      />

      <View className="ml-3 flex-1">
        <Text className="text-xs font-extrabold text-[#0F172A]" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="mt-0.5 text-[11px] font-medium text-[#64748B]">{product.unit}</Text>
        <View className="mt-1 flex-row items-center">
          <Ionicons name="star" size={10} color="#D97706" />
          <Text className="ml-1 text-[11px] font-bold text-[#64748B]">{product.rating}</Text>
        </View>
      </View>

      <View className="items-end">
        <View className="flex-row items-center">
          <Text className="text-xs font-black text-[#0F172A]">{product.price}</Text>
          {product.originalPrice && (
            <Text className="ml-1 text-[10px] font-medium text-slate-400 line-through">
              {product.originalPrice}
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-1.5 rounded-md bg-[#EA580C] px-3 py-1 shadow-sm active:bg-orange-600"
        >
          <Text className="text-[11px] font-black tracking-wider text-white">ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}