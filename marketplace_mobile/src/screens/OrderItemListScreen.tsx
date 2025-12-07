// src/screens/OrderItemListScreen.tsx
import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllOrderItems, deleteOrderItem, OrderItem } from "../services/orderItemService";
import { Loading, EmptyState } from "../components/ui";

export default function OrderItemListScreen() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrderItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrderItems();
    }, [])
  );

  const loadOrderItems = async () => {
    try {
      const res = await getAllOrderItems();
      console.log("API Response:", res);
      console.log("OrderItems data:", res.data);
      
      // El backend devuelve ApiResponse<List<OrderItemResponse>>
      const orderItemsArray = (res.data as any)?.data || res.data;
      console.log("OrderItems array:", orderItemsArray);
      
      setOrderItems(Array.isArray(orderItemsArray) ? orderItemsArray : []);
    } catch (error) {
      console.error("Error loading order items:", error);
      Alert.alert("Error", "Could not load order items");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Order Item",
      "Are you sure you want to permanently delete this order item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOrderItem(id);
              Alert.alert("Success", "Order item deleted successfully");
              loadOrderItems();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete order item");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrderItems();
  };

  if (loading) return <Loading text="Loading order items..." />;

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
              <Text className="text-2xl font-bold text-slate-800">Order Items</Text>
              <Text className="text-slate-600 mt-0.5">
                {orderItems.length} {orderItems.length === 1 ? "item" : "items"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/order-item-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Card List */}
      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="📦"
            title="No order items"
            description="No order items registered. Create one to get started."
            actionLabel="Add Order Item"
            onAction={() => router.push("/order-item-form")}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-slate-100">
            {/* Header with ID */}
            <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Ionicons name="cube-outline" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-xs text-slate-500 uppercase tracking-wide">Item #{item.id}</Text>
                  <Text className="text-lg font-bold text-slate-800 mt-0.5">
                    {item.productName || "N/A"}
                  </Text>
                </View>
              </View>
            </View>



            {/* Financial Info */}
            <View className="bg-slate-50 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="layers-outline" size={16} color="#64748b" />
                  <Text className="text-slate-600 ml-2">Quantity</Text>
                </View>
                <View className="bg-blue-100 px-3 py-1 rounded-lg">
                  <Text className="text-blue-700 font-bold">{item.quantity}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="cash-outline" size={16} color="#64748b" />
                  <Text className="text-slate-600 ml-2">Unit Price</Text>
                </View>
                <Text className="text-slate-800 font-semibold">${item.price.toFixed(2)}</Text>
              </View>

              <View className="h-px bg-slate-200 my-2" />

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="calculator-outline" size={16} color="#10b981" />
                  <Text className="text-slate-700 font-semibold ml-2">Subtotal</Text>
                </View>
                <Text className="text-green-600 font-bold text-lg">${item.subtotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => router.push(`/order-item-form?id=${item.id}`)}
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
