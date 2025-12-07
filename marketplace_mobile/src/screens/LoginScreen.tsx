// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Platform, ScrollView, Dimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const isWeb = Platform.OS === "web";
  const { width } = Dimensions.get("window");
  const isLargeScreen = width >= 768;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      if (isWeb) {
        alert("Please enter email and password");
      } else {
        Alert.alert("Error", "Please enter email and password");
      }
      return;
    }

    setLoading(true);
    try {
      // Intenta login con el backend
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      await setUser(user);
      await setToken(token);

      router.replace("/home");
    } catch (e: any) {
      console.error(e?.response?.data || e.message);
      
      // Login simulado para desarrollo/pruebas
      if (email === "admin@test.com" && password === "admin123") {
        const mockUser = {
          id: 1,
          email: "admin@test.com",
          firstname: "Admin",
          lastname: "User",
          role: "ROLE_ADMIN",
        };
        const mockToken = "mock-jwt-token-12345";
        
        await setUser(mockUser);
        await setToken(mockToken);
        
        router.replace("/home");
        return;
      }

      const errorMsg = "Login failed. Try: admin@test.com / admin123";
      if (isWeb) {
        alert(errorMsg);
      } else {
        Alert.alert("Error", errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail("admin@test.com");
    setPassword("admin123");
  };

  return (
    <ScrollView 
      className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: isWeb && isLargeScreen ? 40 : 24,
      }}
    >
      <View 
        style={{
          width: "100%",
          maxWidth: isWeb && isLargeScreen ? 450 : 400,
        }}
      >
        {/* Header */}
        <View className="mb-8 items-center">
          <View className="bg-primary-500 w-16 h-16 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="storefront" size={32} color="white" />
          </View>
          <Text className="text-4xl font-bold text-slate-800 text-center">
            Marketplace
          </Text>
          <Text className="text-slate-600 mt-2 text-center text-base">
            Wide free market for everyone
          </Text>
        </View>

        {/* Card */}
        <View className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
          <Text className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Welcome Back
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2 text-sm">
              Email Address
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-lg px-4 py-3">
              <Ionicons name="mail-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 text-base"
                placeholder="admin@test.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-slate-700 font-semibold mb-2 text-sm">
              Password
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-lg px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 mr-3 text-slate-900 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#64748b"
                />
              </Pressable>
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            className={`w-full rounded-lg py-4 items-center mb-4 ${
              loading ? "bg-primary-400" : "bg-primary-500"
            } ${isWeb ? "hover:bg-primary-600" : "active:bg-primary-600"}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-bold text-base">
              {loading ? "Logging in..." : "Sign In"}
            </Text>
          </Pressable>

          {/* Test Credentials Button */}
          <Pressable
            className="w-full border-2 border-slate-300 rounded-lg py-3 items-center"
            onPress={fillTestCredentials}
            disabled={loading}
          >
            <Text className="text-slate-600 font-semibold text-sm">
              Use Test Credentials
            </Text>
          </Pressable>

          {/* Info */}
          <View className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Text className="text-blue-800 text-xs text-center font-semibold mb-1">
              📝 Test Credentials
            </Text>
            <Text className="text-blue-700 text-xs text-center">
              Email: admin@test.com
            </Text>
            <Text className="text-blue-700 text-xs text-center">
              Password: admin123
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-slate-500 text-xs text-center mt-6">
          Marketplace © 2025 · All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
}
