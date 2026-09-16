import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useProductSearch } from "@/hooks/search/useProductSearch";
import { Product } from "@/types/productSearchType";

interface SearchOverlayProps {
  searchVisible: boolean;
  setSearchVisible: (visible: boolean) => void;
  topInset: number;
}

export function SearchOverlay({
  searchVisible,
  setSearchVisible,
  topInset,
}: SearchOverlayProps) {
  const router = useRouter();
  const { searchQuery, setSearchQuery, products, isLoading, error } =
    useProductSearch();

  if (!searchVisible) return null;

  const handleProductPress = (productId: string) => {
    setSearchVisible(false); // Close the search overlay
    router.push(`/product/${productId}` as any); // Navigate to product details
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: "#FFFFFF",
        paddingTop: Math.max(topInset, 16),
      }}
    >
      {/* Search Header Input Bar */}
      <View className="px-4 py-3 border-b border-[#E2E8F0] flex-row items-center bg-white shadow-sm">
        <Pressable
          onPress={() => setSearchVisible(false)}
          className="mr-3 p-1 rounded-full active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>

        <View className="flex-1 flex-row items-center rounded-md bg-[#F8FAFC] px-3.5 border border-[#E2E8F0] h-11">
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            autoFocus
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products (e.g., Allu, Rice, Salt)..."
            placeholderTextColor="#94A3B8"
            className="ml-2.5 flex-1 text-xs font-medium text-[#0F172A]"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} className="p-1">
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Content Body */}
      <View className="flex-1 px-4 pt-3 bg-[#F8FAFC]">
        {isLoading && (
          <View className="py-6 items-center">
            <ActivityIndicator size="small" color="#047857" />
            <Text className="mt-2 text-xs text-[#64748B]">Searching products...</Text>
          </View>
        )}

        {error && (
          <Text className="text-center text-red-500 text-xs mt-4">{error}</Text>
        )}

        <FlatList
          data={products}
          keyExtractor={(item: Product) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleProductPress(item.id)}
              className="mb-2.5 flex-row items-center rounded-md bg-white p-3 border border-[#E2E8F0] shadow-sm active:bg-slate-50"
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  className="h-14 w-14 rounded-md bg-slate-100 border border-slate-200"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-14 w-14 rounded-md bg-emerald-50 items-center justify-center border border-emerald-100">
                  <Ionicons name="basket-outline" size={20} color="#047857" />
                </View>
              )}

              <View className="ml-3 flex-1">
                <Text className="text-xs font-extrabold text-[#0F172A]" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="mt-0.5 text-[11px] font-medium text-[#64748B]" numberOfLines={1}>
                  {item.category_name} {item.subcategory_name ? `> ${item.subcategory_name}` : ''}
                </Text>
              </View>

              <View className="h-7 w-7 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200">
                <Ionicons name="chevron-forward" size={14} color="#047857" />
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            !isLoading && searchQuery.trim().length > 0 ? (
              <View className="py-12 items-center">
                <Ionicons name="search-outline" size={40} color="#CBD5E1" />
                <Text className="mt-3 text-xs font-bold text-[#64748B]">
                  No products found for "{searchQuery}"
                </Text>
              </View>
            ) : !isLoading ? (
              <View className="py-12 items-center">
                <Text className="text-xs text-[#94A3B8] font-medium">
                  Type something to search items across store...
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
}