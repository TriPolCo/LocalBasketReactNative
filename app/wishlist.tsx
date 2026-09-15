import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

export default function WishlistScreen() {
  const router = useRouter();
  
  // Dummy wishlist items mimicking the product card layout from the groceries screen
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "prod-1",
      variantId: "var-1",
      name: "Fresh Vegetables Combo",
      attributeText: "Pack: 5 items combo",
      price: 450,
      originalPrice: 600,
      discount: 25,
      imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500",
    },
    {
      id: "prod-2",
      variantId: "var-2",
      name: "Organic Bananas",
      attributeText: "Weight: 1 Dozen",
      price: 60,
      originalPrice: 80,
      discount: 25,
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
    },
    {
      id: "prod-3",
      variantId: "var-3",
      name: "Premium Milk 1L",
      attributeText: "Volume: 1 Liter",
      price: 68,
      originalPrice: 75,
      discount: 9,
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500",
    },
    {
      id: "prod-4",
      variantId: "var-4",
      name: "Button Mushrooms",
      attributeText: "Weight: 200g Pack",
      price: 75,
      originalPrice: 100,
      discount: 25,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
    },
  ]);

  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (variantId: string) => {
    setCart((prev) => ({ ...prev, [variantId]: (prev[variantId] ?? 0) + 1 }));
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[variantId] ?? 0) - 1;
      if (qty <= 0) {
        delete next[variantId];
      } else {
        next[variantId] = qty;
      }
      return next;
    });
  };

  const removeItemFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="px-4 py-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={22} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-lg font-extrabold text-slate-900">My Wishlist</Text>
              <Text className="text-xs text-slate-400">{wishlistItems.length} saved items</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push("/cart")}
            className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50"
          >
            <Ionicons name="cart-outline" size={19} color="#3730A3" />
          </TouchableOpacity>
        </View>

        {/* Content List */}
        <ScrollView 
          contentContainerStyle={{ padding: 12, paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false}
        >
          {wishlistItems.length === 0 ? (
            <View className="mt-32 items-center px-8">
              <Ionicons name="heart-outline" size={48} color="#CBD5E1" />
              <Text className="mt-3 text-center text-sm text-slate-400">
                Your wishlist is empty. Save items you love while shopping!
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {wishlistItems.map((item) => {
                const qtyInCart = cart[item.variantId] ?? 0;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/product/${item.id}` as any)}
                    className="mb-3 w-[48%] overflow-hidden rounded-md bg-white shadow-sm shadow-slate-200"
                  >
                    <View>
                      <Image
                        source={{ uri: item.imageUrl }}
                        className="h-36 w-full bg-slate-100"
                        resizeMode="cover"
                      />

                      {item.discount > 0 && (
                        <View className="absolute left-2 top-2 rounded-md bg-indigo-600 px-2 py-1">
                          <Text className="text-[10px] font-extrabold text-white">
                            {item.discount}% OFF
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={() => removeItemFromWishlist(item.id)}
                        className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs"
                      >
                        <Ionicons name="heart" size={16} color="#DC2626" />
                      </TouchableOpacity>
                    </View>

                    <View className="p-3">
                      <Text
                        numberOfLines={1}
                        className="text-sm font-bold text-slate-900"
                      >
                        {item.name}
                      </Text>

                      <Text numberOfLines={1} className="mt-0.5 text-xs text-slate-500 font-medium">
                        {item.attributeText}
                      </Text>

                      <View className="mt-2 flex-row items-baseline justify-between">
                        <View className="flex-row items-baseline">
                          <Text className="text-base font-extrabold text-slate-900">
                            ₹{item.price}
                          </Text>
                          {item.originalPrice > item.price && (
                            <Text className="ml-1.5 text-xs text-slate-400 line-through">
                              ₹{item.originalPrice}
                            </Text>
                          )}
                        </View>
                      </View>

                      {qtyInCart === 0 ? (
                        <TouchableOpacity
                          onPress={() => addToCart(item.variantId)}
                          className="mt-3 items-center rounded-md bg-indigo-600 border border-indigo-700 py-2"
                        >
                          <Text className="text-xs font-extrabold text-white">
                            ADD TO CART
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="mt-3 flex-row items-center justify-between rounded-xl bg-indigo-600 py-1.5">
                          <TouchableOpacity
                            onPress={() => removeFromCart(item.variantId)}
                            className="h-7 w-9 items-center justify-center"
                          >
                            <Ionicons name="remove" size={16} color="#fff" />
                          </TouchableOpacity>
                          <Text className="text-xs font-extrabold text-white">
                            {qtyInCart}
                          </Text>
                          <TouchableOpacity
                            onPress={() => addToCart(item.variantId)}
                            className="h-7 w-9 items-center justify-center"
                          >
                            <Ionicons name="add" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}