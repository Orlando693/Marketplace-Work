// src/screens/ProductListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { getAllProducts, deleteProduct, Product } from "../services/productService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

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
    if (stock === 0) return { label: "Out of Stock", color: "danger" };
    if (stock < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  if (loading) return <Loading text="Loading products..." />;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Modern Header with back button */}
      <View className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm">
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

      {/* Tabla */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 1100 }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
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
            ListHeaderComponent={() => (
              <View className="bg-slate-800 flex-row px-4 py-3">
                <Text className="text-white font-bold text-xs w-12">ID</Text>
                <Text className="text-white font-bold text-xs w-40">Product Name</Text>
                <Text className="text-white font-bold text-xs flex-1">Description</Text>
                <Text className="text-white font-bold text-xs w-24">Price</Text>
                <Text className="text-white font-bold text-xs w-20">Stock</Text>
                <Text className="text-white font-bold text-xs w-28">Status</Text>
                <Text className="text-white font-bold text-xs w-32">Store</Text>
                <Text className="text-white font-bold text-xs w-24">Reviews</Text>
                <Text className="text-white font-bold text-xs w-28">Published</Text>
                <Text className="text-white font-bold text-xs w-32 text-center">Actions</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const stockStatus = getStockStatus(item.stock);
              return (
                <View className="bg-white flex-row px-4 py-3 border-b border-slate-200 items-center">
                  {/* ID */}
                  <Text className="text-slate-600 text-xs w-12">{item.id}</Text>
                  
                  {/* Product Name */}
                  <View className="w-40">
                    <Text className="text-slate-800 font-bold text-sm" numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                  
                  {/* Description */}
                  <Text className="text-slate-600 text-sm flex-1 pr-2" numberOfLines={2}>
                    {item.description}
                  </Text>
                  
                  {/* Price */}
                  <Text className="text-success-600 font-bold text-sm w-24 font-mono">
                    ${parseFloat(item.price.toString()).toFixed(2)}
                  </Text>
                  
                  {/* Stock */}
                  <View className="w-20">
                    <View className="bg-slate-100 px-2 py-1 rounded">
                      <Text className="text-slate-700 text-xs font-bold text-center">
                        {item.stock}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Stock Status */}
                  <View className="w-28">
                    <View
                      className={`px-2 py-1 rounded ${
                        stockStatus.color === "success"
                          ? "bg-success-100"
                          : stockStatus.color === "warning"
                          ? "bg-warning-100"
                          : "bg-danger-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold text-center ${
                          stockStatus.color === "success"
                            ? "text-success-700"
                            : stockStatus.color === "warning"
                            ? "text-warning-700"
                            : "text-danger-700"
                        }`}
                      >
                        {stockStatus.label}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Store */}
                  <View className="w-32">
                    <View className="bg-slate-100 px-2 py-1 rounded">
                      <Text className="text-slate-700 text-xs font-semibold" numberOfLines={1}>
                        {item.storeName || `Store #${item.storeId}`}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Reviews Count */}
                  <View className="w-24">
                    <View className="flex-row items-center justify-center gap-1">
                      <Ionicons name="star" size={14} color="#eab308" />
                      <Text className="text-warning-600 text-xs font-bold">
                        {item.reviewsId?.length || 0}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Published Date */}
                  <Text className="text-slate-500 text-xs w-28">
                    {formatDate(item.publishedDate)}
                  </Text>
                  
                  {/* Actions */}
                  <View className="flex-row gap-2 w-32 justify-center">
                    <Pressable
                      onPress={() => router.push(`/product-form?id=${item.id}`)}
                      className="bg-warning-500 px-3 py-1 rounded active:bg-warning-600"
                    >
                      <Text className="text-white text-xs font-semibold">Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDelete(item.id)}
                      className="bg-danger-500 px-3 py-1 rounded active:bg-danger-600"
                    >
                      <Text className="text-white text-xs font-semibold">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
