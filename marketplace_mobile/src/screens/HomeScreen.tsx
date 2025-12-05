// src/screens/HomeScreen.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white gap-4">
      <Text className="text-2xl font-bold mb-4">Home</Text>

      <Pressable
        className="bg-black px-4 py-2 rounded-lg"
        onPress={() => router.push("/list")}
      >
        <Text className="text-white">Ir a listado</Text>
      </Pressable>

      <Pressable
        className="bg-gray-800 px-4 py-2 rounded-lg"
        onPress={() => router.push("/form")}
      >
        <Text className="text-white">Ir a formulario</Text>
      </Pressable>
    </View>
  );
}
