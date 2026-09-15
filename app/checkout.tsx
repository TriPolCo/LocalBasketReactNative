// app/checkout.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useCart } from "@/hooks/cart/useCart";
import { useAddresses } from "@/hooks/address/useAddresses";
import { usePlaceOrder } from "@/hooks/order/usePlaceOrder";
import { Address } from "@/types/addressTypes";

export default function CheckoutScreen() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: rawAddresses, isLoading: addressLoading } = useAddresses();
  const placeOrderMutation = usePlaceOrder();

  const addresses = Array.isArray(rawAddresses) ? rawAddresses : [];
  const cartItems = cartData?.items || [];
  const cartId = cartData?.id;

  const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddress?.id || null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const itemTotal = cartData?.subtotal || 0;
  const deliveryFee = 0;
  const platformFee = 10;
  const totalAmount = itemTotal + deliveryFee + (cartItems.length > 0 ? platformFee : 0);

  const handlePlaceOrder = () => {
    if (!cartId) {
      Alert.alert("Error", "Your cart is empty or invalid.");
      return;
    }
    if (!selectedAddressId) {
      Alert.alert("Select Address", "Please select a delivery address to proceed.");
      return;
    }

    placeOrderMutation.mutate(
      {
        cart_id: cartId,
        address_id: selectedAddressId,
      },
      {
        onSuccess: () => {
          setSuccessModalVisible(true);
        },
        onError: (err: any) => {
          Alert.alert("Order Failed", err?.response?.data?.message || "Something went wrong. Please try again.");
        },
      }
    );
  };

  if (cartLoading || addressLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#047857" />
      </SafeAreaView>
    );
  }

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="px-4 py-3.5 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-xs">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1 rounded-full bg-slate-50">
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-base font-extrabold text-slate-900">Checkout</Text>
              <Text className="text-[11px] text-slate-400">Review address & place order</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Delivery Address Section */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-xs">
            <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={18} color="#047857" />
                <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Delivery Address</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/address" as any)}>
                <Text className="text-xs font-bold text-emerald-700">Manage</Text>
              </TouchableOpacity>
            </View>

            {addresses.length === 0 ? (
              <View className="items-center py-4">
                <Text className="text-xs text-slate-500 mb-3">No delivery address found.</Text>
                <TouchableOpacity
                  onPress={() => router.push("/address" as any)}
                  className="bg-emerald-700 px-4 py-2 rounded-xl"
                >
                  <Text className="text-xs font-bold text-white">Add Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {addresses.map((addr: Address) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <TouchableOpacity
                      key={addr.id}
                      onPress={() => setSelectedAddressId(addr.id)}
                      activeOpacity={0.9}
                      className={`p-3.5 rounded-xl border mb-2.5 ${
                        isSelected ? "bg-emerald-50/60 border-emerald-500 shadow-xs" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center">
                          <View className={`px-2 py-0.5 rounded border mr-2 ${isSelected ? "bg-emerald-700 border-emerald-700" : "bg-white border-slate-200"}`}>
                            <Text className={`text-[9px] font-extrabold ${isSelected ? "text-white" : "text-slate-700"}`}>{addr.address_type}</Text>
                          </View>
                          <Text className="text-xs font-bold text-slate-900">{addr.full_name}</Text>
                        </View>
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={18}
                          color={isSelected ? "#047857" : "#94A3B8"}
                        />
                      </View>
                      <Text className="text-xs text-slate-600 leading-relaxed mb-0.5">
                        {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}
                      </Text>
                      <Text className="text-xs text-slate-600 mb-1">
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </Text>
                      <View className="flex-row items-center pt-2 border-t border-slate-200/60">
                        <Ionicons name="call-outline" size={11} color="#64748B" />
                        <Text className="text-[11px] font-semibold text-slate-700 ml-1">{addr.phone_number}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Order Items Review with Images */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-xs">
            <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <View className="flex-row items-center">
                <Ionicons name="basket-outline" size={18} color="#047857" />
                <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Order Items ({cartItems.length})</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/cart" as any)}>
                <Text className="text-xs font-bold text-emerald-700">Edit Cart</Text>
              </TouchableOpacity>
            </View>

            {cartItems.map((item) => {
              const imageUrl = item.primary_image?.image_url || "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500";
              return (
                <View key={item.id} className="flex-row items-center justify-between py-2.5 border-b border-slate-50 last:border-b-0">
                  <View className="flex-row items-center flex-1 pr-3">
                    <Image source={{ uri: imageUrl }} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 mr-3" />
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>{item.product_name}</Text>
                      <Text className="text-[10px] text-slate-400 mt-0.5">{item.sku} • Qty: {item.quantity}</Text>
                    </View>
                  </View>
                  <Text className="text-xs font-extrabold text-slate-900">₹{item.item_total}</Text>
                </View>
              );
            })}
          </View>

          {/* Payment Method */}
          <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-xs">
            <View className="flex-row items-center mb-3 pb-2 border-b border-slate-100">
              <Ionicons name="card-outline" size={18} color="#047857" />
              <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Payment Method</Text>
            </View>

            <TouchableOpacity
              onPress={() => setPaymentMethod("COD")}
              className={`p-3.5 rounded-xl border flex-row items-center justify-between mb-2.5 ${
                paymentMethod === "COD" ? "bg-emerald-50/60 border-emerald-500 shadow-xs" : "bg-slate-50 border-slate-200"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={20} color={paymentMethod === "COD" ? "#047857" : "#64748B"} />
                <View className="ml-3">
                  <Text className="text-xs font-extrabold text-slate-900">Cash on Delivery (COD)</Text>
                  <Text className="text-[10px] text-slate-500 mt-0.5">Pay when your order arrives at your doorstep</Text>
                </View>
              </View>
              <Ionicons
                name={paymentMethod === "COD" ? "radio-button-on" : "radio-button-off"}
                size={18}
                color={paymentMethod === "COD" ? "#047857" : "#94A3B8"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod("ONLINE")}
              className={`p-3.5 rounded-xl border flex-row items-center justify-between ${
                paymentMethod === "ONLINE" ? "bg-emerald-50/60 border-emerald-500 shadow-xs" : "bg-slate-50 border-slate-200"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons name="phone-portrait-outline" size={20} color={paymentMethod === "ONLINE" ? "#047857" : "#64748B"} />
                <View className="ml-3">
                  <Text className="text-xs font-extrabold text-slate-900">Online Payment (UPI / Cards)</Text>
                  <Text className="text-[10px] text-slate-500 mt-0.5">Pay securely online (Coming Soon)</Text>
                </View>
              </View>
              <Ionicons
                name={paymentMethod === "ONLINE" ? "radio-button-on" : "radio-button-off"}
                size={18}
                color={paymentMethod === "ONLINE" ? "#047857" : "#94A3B8"}
              />
            </TouchableOpacity>
          </View>

          {/* Bill Summary */}
          <View className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
            <Text className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Bill Details</Text>
            
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-xs text-slate-600">Item Total</Text>
              <Text className="text-xs font-bold text-slate-900">₹{itemTotal}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-xs text-slate-600">Delivery Fee</Text>
              <Text className="text-xs font-extrabold text-emerald-700">FREE</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-slate-100">
              <Text className="text-xs text-slate-600">Platform Fee</Text>
              <Text className="text-xs font-bold text-slate-900">₹{platformFee}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-extrabold text-slate-900">Total Payable</Text>
              <Text className="text-base font-extrabold text-slate-900">₹{totalAmount}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating Order Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 shadow-lg">
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={placeOrderMutation.isPending || !selectedAddressId || cartItems.length === 0}
            className={`py-3.5 px-4 rounded-xl flex-row items-center justify-between shadow-xs ${
              placeOrderMutation.isPending || !selectedAddressId || cartItems.length === 0
                ? "bg-slate-300"
                : "bg-emerald-700"
            }`}
          >
            <View className="flex-row items-center">
              <Ionicons name="bag-check-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text className="text-xs font-extrabold text-white">
                {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
              </Text>
            </View>
            <Text className="text-sm font-extrabold text-white">₹{totalAmount}</Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <Modal visible={successModalVisible} animationType="fade" transparent onRequestName={() => {}}>
          <View className="flex-1 items-center justify-center bg-black/60 px-6">
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
              {/* Animated Icon Container */}
              <View className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 items-center justify-center mb-4 shadow-sm">
                <Ionicons name="checkmark" size={40} color="#047857" />
              </View>

              <Text className="text-lg font-extrabold text-slate-900 text-center mb-1">
                Your Order Has Been Placed!
              </Text>
              <Text className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
                Thank you for shopping with Daily Drops. Your order is now being processed and will reach you soon.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.replace("/orders" as any);
                }}
                className="bg-emerald-700 w-full py-3.5 rounded-2xl items-center shadow-xs mb-2.5"
              >
                <Text className="text-xs font-extrabold text-white">View Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.replace("/(tabs)/home" as any);
                }}
                className="bg-slate-50 border border-slate-200 w-full py-3.5 rounded-2xl items-center"
              >
                <Text className="text-xs font-bold text-slate-700">Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ProtectedRoute>
  );
}