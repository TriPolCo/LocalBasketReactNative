import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRegister } from "@/hooks/accounts/useRegister"; 

export default function RegisterScreen() {
  const router = useRouter();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, error } = useRegister();

  const handleRegister = async () => {
    await register({
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirm_password,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View className="flex-1 justify-center px-6 py-12">
        {/* Header Icon / Title */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-emerald-50 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="basket" size={32} color="#047857" />
          </View>
          <Text className="text-3xl font-bold text-slate-900">Create Account</Text>
          <Text className="text-slate-500 text-sm mt-1">Sign up to start shopping fresh groceries</Text>
        </View>

        {error && (
          <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <Text className="text-red-700 text-xs font-semibold text-center">{error}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View className="space-y-4">
          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-bold text-slate-700 uppercase mb-1">First Name</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
                placeholder="First name"
                placeholderTextColor="#94A3B8"
                value={first_name}
                onChangeText={setFirstName}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Last Name</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
                placeholder="Last name"
                placeholderTextColor="#94A3B8"
                value={last_name}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View className="mt-3">
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Email Address</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-3">
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              value={phone_number}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mt-3">
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Password</Text>
            <View className="relative flex-row items-center">
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base pr-12"
                placeholder="Create a password"
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

          <View className="mt-3">
            <Text className="text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</Text>
            <TextInput
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-base"
              placeholder="Confirm password"
              placeholderTextColor="#94A3B8"
              value={confirm_password}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="w-full bg-emerald-700 rounded-xl py-4 items-center mt-6 shadow-sm shadow-emerald-900/20"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-base">Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500 text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-emerald-700 font-bold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}