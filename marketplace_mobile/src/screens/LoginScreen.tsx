// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async () => {
    try {
      // Ajusta el body a lo que espera tu AuthController
      const res = await api.post("/auth/login", {
        email,      // o username, según tu backend
        password,
      });

      // Ajusta esto a la respuesta real de tu backend
      const { user, token } = res.data;

      // Guardar en Zustand + AsyncStorage
      await setUser(user);
      await setToken(token);

      router.replace("/home");
    } catch (e: any) {
      console.error(e?.response?.data || e.message);
      Alert.alert(
        "Error",
        "No se pudo iniciar sesión. Verifica tus credenciales o la conexión."
      );
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary-600">
            Marketplace — Login
          </Text>
          <Text className="text-slate-600 mt-2">
            Wide free market for everyone.
          </Text>
        </View>

        {/* Card (similar al web) */}
        <View className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <View className="mb-4">
            <Text className="text-slate-700 font-semibold mb-2">Username</Text>
            <TextInput
              className="w-full rounded-lg bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900"
              placeholder="Enter your username"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-6">
            <Text className="text-slate-700 font-semibold mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className="w-full rounded-lg bg-slate-50 border border-slate-300 px-4 py-3 pr-12 text-slate-900"
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#64748b"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            className="w-full bg-primary-500 rounded-lg py-3 items-center active:bg-primary-600"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-base">
              Login
            </Text>
          </Pressable>
        </View>

        
      </View>
    </View>
  );
}
