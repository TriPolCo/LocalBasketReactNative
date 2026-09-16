import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

const logo = require("@/assets/images/logo22.png");

interface HeaderProps {
  topInset: number;
  onOpenSearch: () => void;
  onPressCart: () => void;
}

export function Header({ topInset, onOpenSearch, onPressCart }: HeaderProps) {
  return (
    <View
      className="bg-emerald-900 px-5 pb-3.5 z-20 border-b border-[#EA580C]"
      style={{ paddingTop: Math.max(topInset, 12) }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image source={logo} className="h-9 w-9 rounded-md mr-2.5" resizeMode="contain" />
          <View>
            <View className="flex-row items-center">
              <Text className="text-xl font-black tracking-tight text-white">Daily</Text>
              <Text className="text-xl font-black tracking-tight text-orange-500">Drop</Text>
            </View>
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="location-sharp" size={11} color="#FFEDD5" />
              <Text className="ml-1 text-[11px] font-medium text-slate-100" numberOfLines={1}>
                Kalahandi, Odisha · 766027
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onOpenSearch}
            className="h-9 w-9 items-center justify-center rounded-md bg-white/15 active:bg-white/25"
          >
            <Ionicons name="search-outline" size={17} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={onPressCart}
            className="h-9 w-9 items-center justify-center rounded-md bg-[#EA580C] active:bg-orange-600 shadow-sm"
          >
            <Ionicons name="cart-outline" size={17} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}