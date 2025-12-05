// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <View className="flex-1 bg-slate-950">
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-slate-50">
            Marketplace
          </Text>
          <Text className="text-slate-400 mt-2">
            Inicia sesión para administrar tus productos y pedidos.
          </Text>
        </View>

        {/* Card */}
        <View className="bg-slate-900/80 rounded-3xl p-6 space-y-4 shadow-xl border border-slate-700">
          <View>
            <Text className="text-slate-300 mb-1">Correo</Text>
            <TextInput
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100"
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-slate-300 mb-1">Contraseña</Text>
            <TextInput
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100"
              placeholder="********"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            className="mt-2 w-full bg-emerald-500 rounded-xl py-3 items-center active:opacity-80"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-base">
              Iniciar sesión
            </Text>
          </Pressable>
        </View>

        <Text className="text-[11px] text-slate-500 text-center mt-6">
          Backend: Spring Boot · Auth: JWT · Cliente: React Native + NativeWind
        </Text>
      </View>
    </View>
  );
}
