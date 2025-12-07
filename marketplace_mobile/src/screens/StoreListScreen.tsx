// src/screens/StoreListScreen.tsx
import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { getAllStores, deleteStore, Store } from "../services/storeService";
import { getAllUsers } from "../services/userService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function StoreListScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStores = async () => {
    try {
      console.log("🔄 Loading stores and users...");
      const [storesRes, usersRes] = await Promise.all([
        getAllStores(),
        getAllUsers(),
      ]);
      
      console.log("🏪 Stores response:", storesRes.data);
      console.log("👥 Users response:", usersRes.data);
      
      // El backend devuelve ApiResponse<List<StoreResponse>>
      const storesArray = (storesRes.data as any)?.data || storesRes.data;
      const usersArray = (usersRes.data as any)?.data || usersRes.data;
      
      console.log("✅ Parsed arrays:", {
        stores: storesArray?.length || 0,
        users: usersArray?.length || 0
      });
      
      // Enriquecer las stores con los nombres de usuario
      const enrichedStores = (Array.isArray(storesArray) ? storesArray : []).map((store: Store) => {
        const user = usersArray.find((u: any) => u.id === store.userId);
        
        return {
          ...store,
          userName: user ? `${user.firstName} ${user.lastName}` : undefined,
        };
      });
      
      console.log("✨ Enriched stores:", enrichedStores);
      setStores(enrichedStores);
    } catch (error) {
      console.error("❌ Error loading stores:", error);
      Alert.alert("Error", "Could not load stores");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStores();
    }, [])
  );

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

      {/* Card List */}
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
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
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-slate-100">
            {/* Header with icon and ID */}
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center mr-3">
                <Ionicons name="storefront-outline" size={24} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 uppercase tracking-wide">Store #{item.id}</Text>
                <Text className="text-lg font-bold text-slate-800 mt-0.5">{item.name}</Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${item.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-xs font-semibold ${item.isActive ? 'text-green-700' : 'text-red-700'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
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
                    <Ionicons name="pricetag-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Category</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{item.category}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="person-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Owner</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{item.userName || `User #${item.userId}`}</Text>
                </View>
              </View>
              <View className="flex-row">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="cube-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Products</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{item.productIds?.length || 0} items</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Created</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{formatDate(item.createdDate)}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => router.push(`/store-form?id=${item.id}`)}
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
        )}
      />
    </View>
  );
}
