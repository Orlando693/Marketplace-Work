// src/screens/HomeScreen.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function HomeScreen() {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white gap-4">
      <Text className="text-2xl font-bold mb-4">Home</Text>

      {/* ... tus botones de ir a List, Form, etc. */}

      <Pressable
        className="mt-10 bg-red-600 px-4 py-2 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold">Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
