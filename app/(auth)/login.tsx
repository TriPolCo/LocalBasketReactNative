import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "@/hooks/accounts/useLogin"; 

export default function LoginScreen() {
  const router = useRouter();
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useLogin();

  const handleLogin = async () => {
    if (!phone_number || !password) return;
    await login({ phone_number, password });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View className="flex-1 justify-center px-6 py-12">
        {/* Header Icon / Title */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-emerald-50 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="leaf" size={32} color="#047857" />
          </View>
          <Text className="text-3xl font-bold text-slate-900">Welcome Back</Text>
          <Text className="text-slate-500 text-sm mt-1">Sign in to manage your orders & cart</Text>
        </View>

        {error && (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <Text className="text-red-700 text-xs font-semibold text-center">{error}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View className="space-y-4">
          <View>
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
              placeholder="Enter your phone number"
              placeholderTextColor="#94A3B8"
              value={phone_number}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mt-4">
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base pr-12"
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4"
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="w-full bg-emerald-700 rounded-xl py-4 items-center mt-6 shadow-sm shadow-emerald-900/20"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500 text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-emerald-700 font-bold text-sm">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}