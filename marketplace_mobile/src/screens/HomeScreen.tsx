// src/screens/HomeScreen.tsx
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui";

export default function HomeScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header con color primary (azul como web) */}
      <View className="bg-primary-600 px-6 pt-12 pb-8 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">
          Welcome to Marketplace
        </Text>
        <Text className="text-primary-100 text-lg mt-2">
          {user?.firstname || user?.email || "User"}
        </Text>
        <Text className="text-primary-200 text-sm mt-1">
          {user?.role || "ROLE_USER"}
        </Text>
      </View>

      {/* Contenido */}
      <View className="px-6 mt-6">
        {/* Sección de módulos */}
        <Text className="text-2xl font-bold text-slate-800 mb-4">
          Modules
        </Text>

        <View className="flex-row flex-wrap gap-4 mb-6">
          {/* Users */}
          <Pressable
            onPress={() => router.push("/user-list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-primary-500 active:scale-95"
          >
            <Ionicons name="people-outline" size={40} color="#3b82f6" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              Users
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages user data, orders and shows reviews
            </Text>
          </Pressable>

          {/* Orders */}
          <Pressable
            onPress={() => router.push("/order-list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-slate-800 active:scale-95"
          >
            <Ionicons name="cart-outline" size={40} color="#1e293b" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              Orders
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages orders and order data
            </Text>
          </Pressable>

          {/* OrderItems */}
          <Pressable
            onPress={() => router.push("/order-item-list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-success-500 active:scale-95"
          >
            <Ionicons name="cube-outline" size={40} color="#22c55e" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              OrderItems
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages orderItems
            </Text>
          </Pressable>

          {/* Reviews */}
          <Pressable
            onPress={() => router.push("/review-list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-blue-400 active:scale-95"
          >
            <Ionicons name="document-text-outline" size={40} color="#60a5fa" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              Reviews
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages reviews and shows reviews
            </Text>
          </Pressable>

          {/* Products */}
          <Pressable
            onPress={() => router.push("/list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-warning-500 active:scale-95"
          >
            <Ionicons name="bag-outline" size={40} color="#eab308" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              Products
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages products
            </Text>
          </Pressable>

          {/* Store */}
          <Pressable
            onPress={() => router.push("/store-list")}
            className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 items-center shadow-lg border-2 border-slate-500 active:scale-95"
          >
            <Ionicons name="storefront-outline" size={40} color="#64748b" />
            <Text className="text-slate-800 font-semibold text-center mb-1 mt-2">
              Store
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              Manages and shows store
            </Text>
          </Pressable>
        </View>

        {/* Footer text */}
        <View className="mt-4 mb-6">
          <Text className="text-slate-400 text-xs text-center">
            Empowering organizations with efficient employee management tools.
          </Text>
        </View>

        {/* Botón de cerrar sesión */}
        <View className="mb-8">
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}
