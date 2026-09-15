import React from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export function ProfileHeader({ user, onImageSelected, uploading }: { user: any; onImageSelected: (uri: string) => void; uploading: boolean }) {
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View className="bg-white p-4 rounded-2xl shadow-xs mb-3 border border-slate-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={handlePickImage} disabled={uploading} className="relative">
            <Image
              source={{ uri: user?.profile_image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" }}
              className="w-16 h-16 rounded-full bg-slate-100"
            />
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-slate-100 shadow-xs items-center justify-center">
              {uploading ? (
                <ActivityIndicator size="small" color="#047857" />
              ) : (
                <Ionicons name="camera" size={12} color="#047857" />
              )}
            </View>
          </TouchableOpacity>
          <View className="ml-3.5 flex-1">
            <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">{user?.phone_number}</Text>
            <Text className="text-xs text-slate-400 mt-0.5" numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </View>
    </View>
  );
}