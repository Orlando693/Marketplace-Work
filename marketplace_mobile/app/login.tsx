import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import "../global.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,      // si tu backend usa "username" en vez de "email", cámbialo aquí
        password,
      });

      // Ajusta esto según tu AuthController:
      const { user, token } = response.data;

      setAuth(user, token);
      router.replace("/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo iniciar sesión. Verifica tus datos.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold mb-8">Marketplace</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="w-full bg-black rounded-lg py-3 items-center"
        onPress={handleLogin}
      >
        <Text className="text-white font-semibold">Iniciar sesión</Text>
      </Pressable>
    </View>
  );
}
