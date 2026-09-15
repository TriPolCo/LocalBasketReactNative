// app/address.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddresses } from "@/hooks/address/useAddresses";
import { useCreateAddress } from "@/hooks/address/useCreateAddress";
import { useUpdateAddress } from "@/hooks/address/useUpdateAddress";
import { useSetDefaultAddress } from "@/hooks/address/useSetDefaultAddress";
import { useDeleteAddress } from "@/hooks/address/useDeleteAddress";
import { Address, AddressPayload } from "@/types/addressTypes";

export default function AddressScreen() {
  const router = useRouter();
  const { data: rawAddresses, isLoading, error, refetch } = useAddresses();
  const addresses = Array.isArray(rawAddresses) ? rawAddresses : [];
  
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const [form, setForm] = useState<AddressPayload>({
    address_type: "HOME",
    full_name: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      address_type: "HOME",
      full_name: "",
      phone_number: "",
      address_line_1: "",
      address_line_2: "",
      landmark: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false,
    });
    setModalVisible(true);
  };

  const handleOpenEdit = (item: Address) => {
    setEditingId(item.id);
    setForm({
      address_type: item.address_type || "HOME",
      full_name: item.full_name || "",
      phone_number: item.phone_number || "",
      address_line_1: item.address_line_1 || "",
      address_line_2: item.address_line_2 || "",
      landmark: item.landmark || "",
      city: item.city || "",
      state: item.state || "",
      postal_code: item.postal_code || "",
      country: item.country || "India",
      is_default: item.is_default || false,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.full_name || !form.phone_number || !form.address_line_1 || !form.city || !form.state || !form.postal_code) {
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        { addressId: editingId, payload: form },
        {
          onSuccess: () => setModalVisible(false),
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => setModalVisible(false),
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultMutation.mutate(id, {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 50);
      },
    });
  };

  const confirmDelete = (id: string) => {
    setAddressToDelete(id);
    setDeleteDialogVisible(true);
  };

  const executeDelete = () => {
    if (addressToDelete) {
      deleteMutation.mutate(addressToDelete, {
        onSuccess: () => {
          setDeleteDialogVisible(false);
          setAddressToDelete(null);
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "left", "right"]}>
      <View className="px-4 py-3.5 bg-white border-b border-slate-100 flex-row items-center justify-between shadow-xs">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1 rounded-full bg-slate-50">
            <Ionicons name="arrow-back" size={20} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text className="text-base font-extrabold text-slate-900">My Addresses</Text>
            <Text className="text-[11px] text-slate-400">Manage your delivery locations</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleOpenCreate}
          className="flex-row items-center bg-emerald-700 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white ml-1">Add New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#047857" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-base font-bold text-slate-700 mt-4">Failed to load addresses</Text>
          <Text className="text-xs text-slate-400 text-center mt-1">Please check your connection and try again.</Text>
        </View>
      ) : addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="location-outline" size={64} color="#CBD5E1" />
          <Text className="text-base font-bold text-slate-700 mt-4">No saved addresses</Text>
          <Text className="text-xs text-slate-400 text-center mt-1">Add a delivery address for quick checkout.</Text>
          <TouchableOpacity
            onPress={handleOpenCreate}
            className="mt-6 bg-emerald-700 px-6 py-3.5 rounded-xl shadow-xs"
          >
            <Text className="text-xs font-bold text-white">Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {addresses.map((item: Address) => (
            <View 
              key={item.id} 
              className={`bg-white p-5 rounded-2xl mb-3.5 border ${
                item.is_default ? "border-emerald-500 shadow-sm shadow-emerald-100" : "border-slate-100 shadow-xs"
              }`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <View className={`px-2.5 py-1 rounded-lg border ${
                    item.is_default ? "bg-emerald-700 border-emerald-700" : "bg-emerald-50 border-emerald-100"
                  }`}>
                    <Text className={`text-[10px] font-extrabold ${
                      item.is_default ? "text-white" : "text-emerald-700"
                    }`}>
                      {item.address_type}
                    </Text>
                  </View>
                  {item.is_default && (
                    <View className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Text className="text-[9px] font-bold text-emerald-800">DEFAULT</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(item)}
                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 items-center justify-center"
                  >
                    <Ionicons name="create-outline" size={14} color="#475569" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => confirmDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 border border-red-100 items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={14} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-sm font-extrabold text-slate-900 mb-1">{item.full_name}</Text>
              <Text className="text-xs text-slate-600 leading-relaxed mb-1">
                {item.address_line_1}{item.address_line_2 ? `, ${item.address_line_2}` : ""}
              </Text>
              {item.landmark && (
                <Text className="text-[11px] text-slate-400 mb-1">Landmark: {item.landmark}</Text>
              )}
              <Text className="text-xs text-slate-600 mb-2">
                {item.city}, {item.state} - {item.postal_code}
              </Text>

              <View className="mt-2 pt-3 border-t border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={12} color="#64748B" />
                  <Text className="text-xs font-semibold text-slate-700 ml-1.5">{item.phone_number}</Text>
                </View>

                {!item.is_default && (
                  <TouchableOpacity 
                    onPress={() => handleSetDefault(item.id)}
                    disabled={setDefaultMutation.isPending}
                    className="bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
                  >
                    <Text className="text-[11px] font-bold text-emerald-700">
                      {setDefaultMutation.isPending ? "Setting..." : "Set as Default"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Create / Edit Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-[85%]">
            <View className="flex-row items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <Text className="text-base font-extrabold text-slate-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 rounded-full bg-slate-100">
                <Ionicons name="close" size={20} color="#334155" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Address Type</Text>
              <View className="flex-row gap-2 mb-3">
                {["HOME", "WORK", "OTHER"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setForm({ ...form, address_type: type })}
                    className={`flex-1 py-2 rounded-xl border items-center ${
                      form.address_type === type ? "bg-emerald-50 border-emerald-700" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Text className={`text-xs font-bold ${form.address_type === type ? "text-emerald-800" : "text-slate-600"}`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</Text>
              <TextInput
                value={form.full_name}
                onChangeText={(val) => setForm({ ...form, full_name: val })}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 mb-3"
              />

              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</Text>
              <TextInput
                value={form.phone_number}
                onChangeText={(val) => setForm({ ...form, phone_number: val })}
                placeholder="10-digit mobile number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 mb-3"
              />

              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Address Line 1</Text>
              <TextInput
                value={form.address_line_1}
                onChangeText={(val) => setForm({ ...form, address_line_1: val })}
                placeholder="House No., Building Name, Street"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 mb-3"
              />

              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Address Line 2 (Optional)</Text>
              <TextInput
                value={form.address_line_2}
                onChangeText={(val) => setForm({ ...form, address_line_2: val })}
                placeholder="Apartment, Suite, Unit, etc."
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 mb-3"
              />

              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Landmark (Optional)</Text>
              <TextInput
                value={form.landmark}
                onChangeText={(val) => setForm({ ...form, landmark: val })}
                placeholder="E.g. Near Apollo Hospital"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800 mb-3"
              />

              <View className="flex-row gap-2 mb-3">
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">City</Text>
                  <TextInput
                    value={form.city}
                    onChangeText={(val) => setForm({ ...form, city: val })}
                    placeholder="City"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">State</Text>
                  <TextInput
                    value={form.state}
                    onChangeText={(val) => setForm({ ...form, state: val })}
                    placeholder="State"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800"
                  />
                </View>
              </View>

              <View className="flex-row gap-2 mb-4">
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Postal Code</Text>
                  <TextInput
                    value={form.postal_code}
                    onChangeText={(val) => setForm({ ...form, postal_code: val })}
                    placeholder="Postal Code"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    maxLength={6}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Country</Text>
                  <TextInput
                    value={form.country}
                    onChangeText={(val) => setForm({ ...form, country: val })}
                    placeholder="Country"
                    placeholderTextColor="#94A3B8"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-800"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-emerald-700 py-3.5 rounded-xl items-center shadow-xs"
              >
                <Text className="text-xs font-extrabold text-white">
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={deleteDialogVisible} animationType="fade" transparent onRequestClose={() => setDeleteDialogVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm items-center shadow-lg">
            <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-3">
              <Ionicons name="trash-outline" size={24} color="#DC2626" />
            </View>
            <Text className="text-base font-extrabold text-slate-900 mb-1 text-center">Delete Address?</Text>
            <Text className="text-xs text-slate-500 text-center mb-5">
              Are you sure you want to delete this delivery address? This action cannot be undone.
            </Text>
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                onPress={() => setDeleteDialogVisible(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 bg-slate-50 items-center"
              >
                <Text className="text-xs font-bold text-slate-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={executeDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-red-600 items-center shadow-xs"
              >
                <Text className="text-xs font-bold text-white">
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}