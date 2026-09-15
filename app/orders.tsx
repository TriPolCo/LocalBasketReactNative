import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useOrders } from "@/hooks/order/useOrders";
import { useCancelOrder } from "@/hooks/order/useCancelOrder";
import { Order, OrderItem } from "@/types/orderTypes";

export default function MyOrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const { data: rawOrders, isLoading, error, refetch } = useOrders();
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  const cancelMutation = useCancelOrder();

  const handleCancelOrder = (orderId: string) => {
    cancelMutation.mutate(orderId, {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 50);
      },
    });
  };

  const filteredOrders = orders.filter((order: Order) => {
    if (selectedTab === "All") return true;
    if (selectedTab === "Processing") return order.status === "PROCESSING";
    if (selectedTab === "Shipped") return order.status === "SHIPPED";
    if (selectedTab === "Delivered") return order.status === "DELIVERED";
    if (selectedTab === "Cancelled") return order.status === "CANCELLED";
    return true;
  });

  const getStatusConfig = (status: Order["status"]) => {
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
          text: status,
        };
    }
  };

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
              <Text className="text-base font-extrabold text-slate-900">My Orders</Text>
              <Text className="text-[11px] text-slate-400">Track, manage and review your purchases</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="bg-white py-2.5 border-b border-slate-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-md mr-2 border ${
                  selectedTab === tab
                    ? "bg-emerald-700 border-emerald-700 shadow-xs"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedTab === tab ? "text-white" : "text-slate-600"}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Body */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#047857" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-base font-bold text-slate-700 mt-4">Failed to load orders</Text>
            <Text className="text-xs text-slate-400 text-center mt-1">Please check your connection and try again.</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
            <Text className="text-base font-bold text-slate-700 mt-4">No orders found</Text>
            <Text className="text-xs text-slate-400 text-center mt-1">You haven't placed any orders in this category yet.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            {filteredOrders.map((order: Order) => {
              const statusCfg = getStatusConfig(order.status);
              const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const visibleItems = order.items.slice(0, 3);
              const remainingCount = order.items.length - 3;

              return (
                <TouchableOpacity
                  key={order.id}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/orders/${order.id}` as any)}
                  className="bg-white rounded-md p-4 mb-4 border border-slate-100 shadow-xs"
                >
                  <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <View>
                      <Text className="text-xs font-extrabold text-slate-900">{order.order_number}</Text>
                      <Text className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <View className={`flex-row items-center px-2.5 py-1 rounded-md border ${statusCfg.color}`}>
                      <Ionicons name={statusCfg.icon} size={12} color={statusCfg.iconColor} style={{ marginRight: 4 }} />
                      <Text className="text-[10px] font-bold">{statusCfg.text}</Text>
                    </View>
                  </View>

                  {/* Product Images & Info Row */}
                  <View className="flex-row items-center justify-between py-2 border-y border-slate-50 mb-3" onStartShouldSetResponder={() => true}>
                    <View className="flex-row items-center flex-1">
                      {visibleItems.map((item: any, i: number) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => router.push(`/product/${item.product}` as any)}
                          className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 overflow-hidden mr-2"
                        >
                          <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
                        </TouchableOpacity>
                      ))}
                      {remainingCount > 0 && (
                        <View className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 items-center justify-center">
                          <Text className="text-xs font-extrabold text-emerald-800">+{remainingCount}</Text>
                        </View>
                      )}
                    </View>

                    <View className="items-end">
                      <View className="flex-row items-center">
                        <Text className="text-sm font-extrabold text-slate-900">₹{order.total_amount}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 4 }} />
                      </View>
                      <Text className="text-[10px] text-slate-400 mt-0.5">{totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}</Text>
                    </View>
                  </View>

                  {/* Shipping Address Summary */}
                  {order.shipping_address && (
                    <View className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      <View className="flex-row items-center mb-0.5">
                        <Ionicons name="location-outline" size={12} color="#047857" />
                        <Text className="text-[11px] font-bold text-slate-800 ml-1">
                          Delivery to: {order.shipping_address.full_name}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-500 leading-tight pl-4" numberOfLines={1}>
                        {order.shipping_address.address_line_1}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                      </Text>
                    </View>
                  )}

                  {/* Actions / Status Footer */}
                  <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
                    <View className="flex-row items-center flex-1 mr-2">
                      <Ionicons name="information-circle-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text className="text-[11px] text-slate-500 flex-1" numberOfLines={1}>
                        Payment: {order.payment_method} ({order.payment_status})
                      </Text>
                    </View>

                    {order.status === "PROCESSING" && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                        disabled={cancelMutation.isPending}
                        className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-md"
                      >
                        <Text className="text-xs font-bold text-red-600">
                          {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </ProtectedRoute>
  );
}