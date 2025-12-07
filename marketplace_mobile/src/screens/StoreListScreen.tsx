// src/screens/StoreListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { getAllStores, deleteStore, Store } from "../services/storeService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function StoreListScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const res = await getAllStores();
      console.log("API Response:", res);
      console.log("Stores data:", res.data);
      
      // El backend devuelve ApiResponse<List<StoreResponse>>
      const storesArray = (res.data as any)?.data || res.data;
      console.log("Stores array:", storesArray);
      
      setStores(Array.isArray(storesArray) ? storesArray : []);
    } catch (error) {
      console.error("Error loading stores:", error);
      Alert.alert("Error", "Could not load stores");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Store",
      "Are you sure you want to permanently delete this store?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStore(id);
              Alert.alert("Success", "Store deleted successfully");
              loadStores();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete store");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStores();
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Electronics": "📱",
      "Clothing": "👕",
      "Books": "📚",
      "Food": "🍔",
      "Furniture": "🪑",
      "Toys": "🧸",
      "Sports": "⚽",
      "Beauty": "💄",
      "Health": "💊",
    };
    return icons[category] || "🏪";
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

  if (loading) return <Loading text="Loading stores..." />;

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
              <Text className="text-2xl font-bold text-slate-800">Stores</Text>
              <Text className="text-slate-600 mt-0.5">
                {stores.length} {stores.length === 1 ? "store" : "stores"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/store-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabla */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 1000 }}>
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <EmptyState
                icon="🏪"
                title="No stores"
                description="No stores registered. Create one to get started."
                actionLabel="Add Store"
                onAction={() => router.push("/store-form")}
              />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View className="bg-slate-800 flex-row px-4 py-3">
                <Text className="text-white font-bold text-xs w-12">ID</Text>
                <Text className="text-white font-bold text-xs w-40">Store Name</Text>
                <Text className="text-white font-bold text-xs flex-1">Description</Text>
                <Text className="text-white font-bold text-xs w-28">Category</Text>
                <Text className="text-white font-bold text-xs w-20">Status</Text>
                <Text className="text-white font-bold text-xs w-24">User ID</Text>
                <Text className="text-white font-bold text-xs w-24">Products</Text>
                <Text className="text-white font-bold text-xs w-28">Created</Text>
                <Text className="text-white font-bold text-xs w-32 text-center">Actions</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="bg-white flex-row px-4 py-3 border-b border-slate-200 items-center">
                {/* ID */}
                <Text className="text-slate-600 text-xs w-12">{item.id}</Text>
                
                {/* Store Name */}
                <View className="w-40">
                  <Text className="text-slate-800 font-bold text-sm" numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
                
                {/* Description */}
                <Text className="text-slate-600 text-sm flex-1 pr-2" numberOfLines={2}>
                  {item.description}
                </Text>
                
                {/* Category */}
                <View className="w-28">
                  <View className="bg-slate-100 px-2 py-1 rounded flex-row items-center gap-1">
                    <Text className="text-xs">{getCategoryIcon(item.category)}</Text>
                    <Text className="text-slate-700 text-xs font-semibold" numberOfLines={1}>
                      {item.category}
                    </Text>
                  </View>
                </View>
                
                {/* Status (isActive) */}
                <View className="w-20">
                  <View
                    className={`px-2 py-1 rounded ${
                      item.isActive ? "bg-success-100" : "bg-danger-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold text-center ${
                        item.isActive ? "text-success-700" : "text-danger-700"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
                
                {/* User ID */}
                <View className="w-24">
                  <View className="bg-primary-100 px-2 py-1 rounded">
                    <Text className="text-primary-700 text-xs font-semibold text-center">
                      U-{item.userId}
                    </Text>
                  </View>
                </View>
                
                {/* Product Count */}
                <View className="w-24">
                  <View className="bg-warning-100 px-2 py-1 rounded">
                    <Text className="text-warning-700 text-xs font-bold text-center">
                      {item.productIds?.length || 0} items
                    </Text>
                  </View>
                </View>
                
                {/* Created Date */}
                <Text className="text-slate-500 text-xs w-28">
                  {formatDate(item.createdDate)}
                </Text>
                
                {/* Actions */}
                <View className="flex-row gap-2 w-32 justify-center">
                  <Pressable
                    onPress={() => router.push(`/store-form?id=${item.id}`)}
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
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
