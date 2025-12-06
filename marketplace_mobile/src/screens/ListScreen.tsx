// src/screens/ListScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";
import { Loading, EmptyState, Card, Button } from "../components/ui";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/products/${id}`);
              Alert.alert("Éxito", "Producto eliminado");
              fetchProducts();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loading text="Cargando productos..." />;

  if (products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No products"
        description="No products registered. Create one to get started."
        actionLabel="Add Product"
        onAction={() => router.push("/form")}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <Text className="text-2xl font-bold text-slate-800">
          Product List
        </Text>
        <Text className="text-slate-600 mt-1">
          {products.length} {products.length === 1 ? "product" : "products"} registered
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <Card>
            <Pressable onPress={() => router.push(`/form?id=${item.id}`)}>
              <Text className="text-xl font-bold text-slate-800 mb-1">
                {item.name}
              </Text>
              <Text className="text-slate-600 mb-3" numberOfLines={2}>
                {item.description}
              </Text>

              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-2xl font-bold text-success-600">
                    ${item.price.toFixed(2)}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    Stock: {item.stock} units
                  </Text>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${
                    item.stock > 10
                      ? "bg-success-100"
                      : item.stock > 0
                      ? "bg-warning-100"
                      : "bg-danger-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      item.stock > 10
                        ? "text-success-700"
                        : item.stock > 0
                        ? "text-warning-700"
                        : "text-danger-700"
                    }`}
                  >
                    {item.stock > 10
                      ? "Available"
                      : item.stock > 0
                      ? "Low stock"
                      : "Out of stock"}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Button
                  title="Edit"
                  variant="outline"
                  onPress={() => router.push(`/form?id=${item.id}`)}
                />
                <Button
                  title="Delete"
                  variant="danger"
                  onPress={() => handleDelete(item.id)}
                />
              </View>
            </Pressable>
          </Card>
        )}
      />

      {/* Botón flotante para crear */}
      <Pressable
        onPress={() => router.push("/form")}
        className="absolute bottom-6 right-6 bg-primary-500 w-16 h-16 rounded-full items-center justify-center shadow-lg active:bg-primary-600"
      >
        <Text className="text-white text-3xl">+</Text>
      </Pressable>
    </View>
  );
}