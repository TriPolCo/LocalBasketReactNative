import React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useProfile } from "@/hooks/accounts/useProfile";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { MembershipBanner } from "@/components/profile/MembershipBanner";
import { QuickActions } from "@/components/profile/QuickActions";
import { RecentOrderCard } from "@/components/profile/RecentOrderCard";
import { AccountSettingsList } from "@/components/profile/AccountSettingsList";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, uploading, uploadAndSaveProfileImage } = useProfile();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("user_data");
    router.replace("/(auth)/login");
  };

  if (loading && !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 90 }}>
        {/* User Info Header with Image Upload Handler */}
        <ProfileHeader 
          user={user} 
          onImageSelected={uploadAndSaveProfileImage} 
          uploading={uploading} 
        />

        {/* LocalBasket Plus Banner */}
        <MembershipBanner />

        {/* Action Grid (Orders, Wishlist, Cart, Addresses) */}
        <QuickActions 
          
        />

        {/* Recent Order Component */}
        <RecentOrderCard />

        {/* Settings List & Logout */}
        <AccountSettingsList onLogout={handleLogout} />
      </ScrollView>
    </ProtectedRoute>
  );
}