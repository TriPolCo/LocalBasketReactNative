import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Product = {
  id: string;
  name: string;
  unit: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
};

interface HorizontalProductScrollProps {
  products: Product[];
}

export function HorizontalProductScroll({ products }: HorizontalProductScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
    >
      {products.map((product) => (
        <View
          key={product.id}
          className="w-36 overflow-hidden rounded-md bg-white p-2 border border-[#E2E8F0] shadow-sm"
        >
          <ImageBackground
            source={{ uri: product.image }}
            className="h-24 w-full overflow-hidden rounded-md bg-[#F8FAFC]"
            imageStyle={{ borderRadius: 6 }}
          />
          <Text numberOfLines={1} className="mt-2 text-xs font-bold text-[#0F172A]">
            {product.name}
          </Text>
          <Text className="text-[11px] font-medium text-[#64748B]">{product.unit}</Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-xs font-black text-[#0F172A]">{product.price}</Text>
            <TouchableOpacity className="h-6 w-6 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200">
              <Ionicons name="add" size={14} color="#047857" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}