import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useOrder } from "@/hooks/order/useOrder";
import { useCancelOrder } from "@/hooks/order/useCancelOrder";
import { OrderItem } from "@/types/orderTypes";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const cancelMutation = useCancelOrder();

  const handleCancelOrder = () => {
    if (!id) return;
    cancelMutation.mutate(id, {
      onSuccess: () => {
        Alert.alert("Success", "Order has been cancelled successfully.");
        refetch();
      },
      onError: (err: any) => {
        Alert.alert("Error", err?.response?.data?.message || "Failed to cancel order.");
      },
    });
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "DELIVERED":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-100",
          icon: "checkmark-circle" as const,
          iconColor: "#047857",
          text: "Delivered",
        };
      case "SHIPPED":
        return {
          color: "text-blue-700 bg-blue-50 border-blue-100",
          icon: "car-outline" as const,
          iconColor: "#2563EB",
          text: "Shipped",
        };
      case "PROCESSING":
        return {
          color: "text-amber-700 bg-amber-50 border-amber-100",
          icon: "time-outline" as const,
          iconColor: "#D97706",
          text: "Processing",
        };
      case "CANCELLED":
        return {
          color: "text-red-700 bg-red-50 border-red-100",
          icon: "close-circle-outline" as const,
          iconColor: "#DC2626",
          text: "Cancelled",
        };
      default:
        return {
          color: "text-slate-700 bg-slate-50 border-slate-100",
          icon: "information-circle-outline" as const,
          iconColor: "#475569",
          text: status || "Unknown",
        };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#047857" />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-base font-bold text-slate-700 mt-4">Order not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-emerald-700 px-6 py-3 rounded-xl">
          <Text className="text-xs font-bold text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const statusCfg = getStatusConfig(order.status);

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="px-4 py-3.5 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-xs">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1 rounded-md bg-slate-50">
              <Ionicons name="arrow-back" size={20} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-base font-extrabold text-slate-900">Order Details</Text>
              <Text className="text-[11px] text-slate-400">{order.order_number}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <View className="bg-white p-4 rounded-md mb-4 border border-slate-100 shadow-xs flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-slate-400 mb-1">Order Status</Text>
              <View className={`flex-row items-center px-3 py-1.5 rounded-md border ${statusCfg.color} self-start`}>
                <Ionicons name={statusCfg.icon} size={14} color={statusCfg.iconColor} style={{ marginRight: 6 }} />
                <Text className="text-xs font-bold">{statusCfg.text}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-xs text-slate-400 mb-1">Placed On</Text>
              <Text className="text-xs font-bold text-slate-800">
                {new Date(order.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          {/* Shipping Address */}
          {order.shipping_address && (
            <View className="bg-white p-4 rounded-md mb-4 border border-slate-100 shadow-xs">
              <View className="flex-row items-center mb-2.5 pb-2 border-b border-slate-100">
                <Ionicons name="location-outline" size={18} color="#047857" />
                <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Delivery Address</Text>
              </View>
              <Text className="text-xs font-bold text-slate-900 mb-1">{order.shipping_address.full_name}</Text>
              <Text className="text-xs text-slate-600 leading-relaxed mb-0.5">
                {order.shipping_address.address_line_1}{order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ""}
              </Text>
              {order.shipping_address.landmark && (
                <Text className="text-[11px] text-slate-400 mb-0.5">Landmark: {order.shipping_address.landmark}</Text>
              )}
              <Text className="text-xs text-slate-600 mb-2">
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
              </Text>
              <View className="flex-row items-center pt-2 border-t border-slate-100">
                <Ionicons name="call-outline" size={12} color="#64748B" />
                <Text className="text-xs font-semibold text-slate-700 ml-1.5">{order.shipping_address.phone_number}</Text>
              </View>
            </View>
          )}

          {/* Order Items */}
          <View className="bg-white p-4 rounded-md mb-4 border border-slate-100 shadow-xs">
            <View className="flex-row items-center mb-3 pb-2 border-b border-slate-100">
              <Ionicons name="basket-outline" size={18} color="#047857" />
              <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Items in Order ({order.items.length})</Text>
            </View>

            {order.items.map((item: OrderItem & { image?: string }) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${item.product}` as any)}
                className="flex-row items-center justify-between py-2.5 border-b border-slate-50 last:border-b-0"
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500" }} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 mr-3" />
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>{item.product_name}</Text>
                    <Text className="text-[10px] text-slate-400 mt-0.5">{item.sku} • Qty: {item.quantity}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-xs font-extrabold text-slate-900">₹{item.item_total}</Text>
                  <Text className="text-[10px] text-slate-400">₹{item.selling_price} each</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Details */}
          <View className="bg-white p-4 rounded-md mb-4 border border-slate-100 shadow-xs">
            <View className="flex-row items-center mb-3 pb-2 border-b border-slate-100">
              <Ionicons name="card-outline" size={18} color="#047857" />
              <Text className="text-xs font-extrabold text-slate-900 ml-1.5 uppercase tracking-wider">Payment Information</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xs text-slate-600">Payment Method</Text>
              <Text className="text-xs font-bold text-slate-900">{order.payment_method}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-slate-600">Payment Status</Text>
              <Text className="text-xs font-bold text-emerald-700">{order.payment_status}</Text>
            </View>
          </View>

          {/* Bill Summary */}
          <View className="bg-white p-4 rounded-md border border-slate-100 shadow-xs">
            <Text className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Bill Details</Text>
            
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-xs text-slate-600">Subtotal</Text>
              <Text className="text-xs font-bold text-slate-900">₹{order.subtotal}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-xs text-slate-600">Delivery Fee</Text>
              <Text className="text-xs font-bold text-slate-900">₹{order.delivery_fee}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-xs text-slate-600">Discount</Text>
              <Text className="text-xs font-bold text-emerald-700">-₹{order.discount}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-slate-100">
              <Text className="text-xs text-slate-600">Tax</Text>
              <Text className="text-xs font-bold text-slate-900">₹{order.tax}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-extrabold text-slate-900">Total Amount</Text>
              <Text className="text-base font-extrabold text-slate-900">₹{order.total_amount}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        {order.status === "PROCESSING" && (
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 shadow-lg">
            <TouchableOpacity
              onPress={handleCancelOrder}
              disabled={cancelMutation.isPending}
              className="bg-red-50 border border-red-200 py-3.5 rounded-md items-center shadow-xs"
            >
              <Text className="text-xs font-extrabold text-red-600">
                {cancelMutation.isPending ? "Cancelling Order..." : "Cancel Order"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ProtectedRoute>
  );
}