import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useCart } from "@/hooks/cart/useCart"; 
import { useUpdateQuantity } from "@/hooks/cart/useUpdateQuantity";
import { useRemoveItem } from "@/hooks/cart/useRemoveItem";
import { useClearCart } from "@/hooks/cart/useClearCart";
import { CartItem } from "@/types/cartTypes";

export default function CartScreen() {
  const router = useRouter();
  const { data: cartData, isLoading, error } = useCart();
  const updateQuantityMutation = useUpdateQuantity();
  const removeItemMutation = useRemoveItem();
  const clearCartMutation = useClearCart();

  const cartItems = cartData?.items || [];
  const totalItemsCount = cartData?.total_quantity || 0;
  const itemTotal = cartData?.subtotal || 0;
  const deliveryFee = 0;
  const platformFee = 10;
  const totalAmount = itemTotal + deliveryFee + (cartItems.length > 0 ? platformFee : 0);
  const totalSaved = 80;

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItemMutation.mutate(itemId);
    } else {
      updateQuantityMutation.mutate({
        itemId,
        payload: { quantity: newQty },
      });
    }
  };

  const removeItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
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
              <Text className="text-lg font-extrabold text-slate-900">My Cart ({totalItemsCount})</Text>
              <Text className="text-xs text-slate-400">Fresh choices for a healthier you</Text>
            </View>
          </View>
          {cartItems.length > 0 && (
            <TouchableOpacity
              onPress={clearCart}
              disabled={clearCartMutation.isPending}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-md border border-red-100"
            >
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
              <Text className="text-xs font-bold text-red-600 ml-1">Clear Cart</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#047857" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-base font-bold text-slate-700 mt-4">Failed to load cart</Text>
            <Text className="text-xs text-slate-400 text-center mt-1">Please check your connection and try again.</Text>
          </View>
        ) : cartItems.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="cart-outline" size={64} color="#CBD5E1" />
            <Text className="text-base font-bold text-slate-700 mt-4">Your cart is empty</Text>
            <Text className="text-xs text-slate-400 text-center mt-1">Explore our categories and add fresh groceries to your cart.</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home" as any)}
              className="mt-6 bg-emerald-700 px-6 py-3 rounded-md shadow-xs"
            >
              <Text className="text-xs font-bold text-white">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            {/* Free Delivery Progress Banner */}
            <View className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-md mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-7 h-7 rounded-md bg-emerald-700 items-center justify-center mr-2">
                    <Ionicons name="bicycle" size={14} color="#FFFFFF" />
                  </View>
                  <Text className="text-xs font-extrabold text-emerald-900">You're eligible for free delivery!</Text>
                </View>
                <Ionicons name="gift" size={18} color="#047857" />
              </View>
              <View className="h-2 bg-emerald-200/60 rounded-md overflow-hidden mb-1.5">
                <View className="h-full bg-emerald-700 w-3/4 rounded-md" />
              </View>
              <Text className="text-[11px] text-emerald-800 font-medium">₹{itemTotal} / ₹500</Text>
            </View>

            {/* Cart Items List */}
            {cartItems.map((item: CartItem) => {
              const sellingPrice = parseFloat(item.selling_price) || 0;
              const mrp = parseFloat(item.mrp) || 0;
              const imageUrl = item.primary_image?.image_url || "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500";

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(`/product/${item.product_id}` as any)}
                  activeOpacity={0.9}
                  className="bg-white p-3.5 rounded-md mb-3 border border-slate-100 shadow-xs flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <Image source={{ uri: imageUrl }} className="w-14 h-14 rounded-md bg-slate-50 border border-slate-100" />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{item.product_name}</Text>
                      <Text className="text-xs text-slate-400 mt-0.5">{item.sku}</Text>
                      <View className="flex-row items-center mt-1">
                        <View className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 mr-2">
                          <Text className="text-[10px] font-bold text-emerald-700">In Stock</Text>
                        </View>
                      </View>
                      <View className="flex-row items-baseline mt-1.5">
                        <Text className="text-sm font-extrabold text-slate-900">₹{item.item_total}</Text>
                        {mrp > sellingPrice && (
                          <Text className="text-[11px] text-slate-400 line-through ml-1.5">₹{mrp * item.quantity}</Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Stepper & Delete */}
                  <View className="items-end justify-between self-stretch py-0.5" onStartShouldSetResponder={() => true}>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>

                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1 mt-auto">
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} className="px-1.5">
                        <Ionicons name="remove" size={12} color="#0f172a" />
                      </TouchableOpacity>
                      <Text className="text-xs font-extrabold text-slate-900 mx-2">{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="px-1.5">
                        <Ionicons name="add" size={12} color="#0f172a" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Price Details */}
            <View className="bg-white p-4 rounded-md mb-4 border border-slate-100 shadow-xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Price Details</Text>
              
              <View className="flex-row justify-between items-center mb-2.5">
                <Text className="text-xs text-slate-600">Item Total ({totalItemsCount} items)</Text>
                <Text className="text-xs font-bold text-slate-900">₹{itemTotal}</Text>
              </View>

              <View className="flex-row justify-between items-center mb-2.5">
                <Text className="text-xs text-slate-600">Delivery Fee</Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-slate-400 line-through mr-1.5">₹40</Text>
                  <Text className="text-xs font-extrabold text-emerald-700">FREE</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-slate-100">
                <View className="flex-row items-center">
                  <Text className="text-xs text-slate-600 mr-1">Platform Fee</Text>
                  <Ionicons name="information-circle-outline" size={14} color="#94A3B8" />
                </View>
                <Text className="text-xs font-bold text-slate-900">₹{platformFee}</Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-extrabold text-slate-900">Total Amount</Text>
                <Text className="text-base font-extrabold text-slate-900">₹{totalAmount}</Text>
              </View>
            </View>

            {/* Savings Badge */}
            <View className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-md bg-emerald-700 items-center justify-center mr-2.5">
                  <Ionicons name="pricetag" size={14} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-emerald-900">You saved ₹{totalSaved}</Text>
                  <Text className="text-[10px] text-emerald-700 mt-0.5">with product discounts</Text>
                </View>
              </View>
              <Text className="text-lg">🎉</Text>
            </View>
          </ScrollView>
        )}

        {/* Floating Checkout Footer */}
        {cartItems.length > 0 && !isLoading && (
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 shadow-lg">
            <TouchableOpacity
              onPress={() => router.push("/checkout" as any)}
              className="bg-emerald-700 py-3.5 px-4 rounded-md flex-row items-center justify-between shadow-xs"
            >
              <Text className="text-sm font-extrabold text-white">Proceed to Checkout</Text>
              <View className="flex-row items-center">
                <Text className="text-sm font-extrabold text-white mr-1.5">₹{totalAmount}</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ProtectedRoute>
  );
}