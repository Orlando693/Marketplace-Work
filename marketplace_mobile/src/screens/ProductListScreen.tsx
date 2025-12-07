// src/screens/ProductListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { getAllProducts, deleteProduct, Product } from "../services/productService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      console.log("API Response:", res);
      console.log("Products data:", res.data);
      
      // El backend devuelve ApiResponse<List<ProductResponse>>
      const productsArray = (res.data as any)?.data || res.data;
      console.log("Products array:", productsArray);
      
      setProducts(Array.isArray(productsArray) ? productsArray : []);
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert("Error", "Could not load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to permanently delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              Alert.alert("Success", "Product deleted successfully");
              loadProducts();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100", textColor: "text-red-700" };
    if (stock < 10) return { label: "Low Stock", color: "bg-yellow-100", textColor: "text-yellow-700" };
    return { label: "In Stock", color: "bg-green-100", textColor: "text-green-700" };
  };

  if (loading) return <Loading text="Loading products..." />;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Modern Header with back button */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => router.push("/home")}
              className="mr-4 p-2 rounded-full bg-slate-100 active:bg-slate-200"
            >
              <Ionicons name="arrow-back" size={20} color="#1e293b" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-slate-800">Products</Text>
              <Text className="text-slate-600 mt-0.5">
                {products.length} {products.length === 1 ? "product" : "products"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/product-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Card List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon="📦"
            title="No products"
            description="No products registered. Create one to get started."
            actionLabel="Add Product"
            onAction={() => router.push("/product-form")}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          const stockStatus = getStockStatus(item.stock);
          return (
            <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-slate-100">
              {/* Header with icon and ID */}
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-xl bg-purple-100 items-center justify-center mr-3">
                  <Ionicons name="cube-outline" size={24} color="#9333ea" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-slate-500 uppercase tracking-wide">Product #{item.id}</Text>
                  <Text className="text-lg font-bold text-slate-800 mt-0.5">{item.name}</Text>
                </View>
                <View className={`px-3 py-1.5 rounded-full ${stockStatus.color}`}>
                  <Text className={`text-xs font-semibold ${stockStatus.textColor}`}>
                    {stockStatus.label}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text className="text-slate-600 mb-4 leading-5">{item.description}</Text>

              {/* Info Grid */}
              <View className="bg-slate-50 rounded-xl p-4 mb-4">
                <View className="flex-row mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="cash-outline" size={16} color="#64748b" />
                      <Text className="text-xs text-slate-500 ml-1.5">Price</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-800">${item.price}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="cube-outline" size={16} color="#64748b" />
                      <Text className="text-xs text-slate-500 ml-1.5">Stock</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-800">{item.stock} units</Text>
                  </View>
                </View>
                <View className="flex-row">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="storefront-outline" size={16} color="#64748b" />
                      <Text className="text-xs text-slate-500 ml-1.5">Store ID</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-800">#{item.storeId}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="calendar-outline" size={16} color="#64748b" />
                      <Text className="text-xs text-slate-500 ml-1.5">Published</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-800">{formatDate(item.publishedDate)}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => router.push(`/product-form?id=${item.id}`)}
                  className="flex-1 bg-yellow-500 py-3 rounded-xl flex-row items-center justify-center active:bg-yellow-600"
                >
                  <Ionicons name="create-outline" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  className="flex-1 bg-red-500 py-3 rounded-xl flex-row items-center justify-center active:bg-red-600"
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Delete</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
