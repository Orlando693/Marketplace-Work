// src/screens/OrderItemListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { getAllOrderItems, deleteOrderItem, OrderItem } from "../services/orderItemService";
import { Loading, EmptyState } from "../components/ui";

export default function OrderItemListScreen() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrderItems();
  }, []);

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

  if (orderItems.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No order items"
        description="No order items registered. Create one to get started."
        actionLabel="Add Order Item"
        onAction={() => router.push("/order-item-form")}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-slate-800">Order Items</Text>
            <Text className="text-slate-600 mt-1">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"} registered
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/order-item-form")}
            className="bg-success-500 px-4 py-2 rounded-lg active:bg-success-600"
          >
            <Text className="text-white font-semibold">Add Item</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabla */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 900 }}>
          <FlatList
            data={orderItems}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View className="bg-slate-800 flex-row px-4 py-3">
                <Text className="text-white font-bold text-xs w-12">ID</Text>
                <Text className="text-white font-bold text-xs w-32">Product</Text>
                <Text className="text-white font-bold text-xs w-20">Qty</Text>
                <Text className="text-white font-bold text-xs w-24">Price</Text>
                <Text className="text-white font-bold text-xs w-24">Subtotal</Text>
                <Text className="text-white font-bold text-xs w-24">Order ID</Text>
                <Text className="text-white font-bold text-xs w-24">Product ID</Text>
                <Text className="text-white font-bold text-xs flex-1 text-center">Actions</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="bg-white flex-row px-4 py-3 border-b border-slate-200 items-center">
                {/* ID */}
                <Text className="text-slate-600 text-xs w-12">{item.id}</Text>
                
                {/* Product Name */}
                <Text className="text-slate-800 font-semibold text-sm w-32" numberOfLines={2}>
                  {item.productName || "N/A"}
                </Text>
                
                {/* Quantity */}
                <View className="w-20">
                  <View className="bg-slate-100 px-2 py-1 rounded">
                    <Text className="text-slate-700 text-xs font-bold text-center">
                      {item.quantity}
                    </Text>
                  </View>
                </View>
                
                {/* Price */}
                <Text className="text-slate-600 text-xs w-24 font-mono">
                  ${item.price.toFixed(2)}
                </Text>
                
                {/* Subtotal */}
                <Text className="text-success-600 text-sm font-bold w-24 font-mono">
                  ${item.subtotal.toFixed(2)}
                </Text>
                
                {/* Order ID */}
                <View className="w-24">
                  <View className="bg-primary-100 px-2 py-1 rounded">
                    <Text className="text-primary-700 text-xs font-semibold text-center">
                      #{item.orderId}
                    </Text>
                  </View>
                </View>
                
                {/* Product ID */}
                <View className="w-24">
                  <View className="bg-warning-100 px-2 py-1 rounded">
                    <Text className="text-warning-700 text-xs font-semibold text-center">
                      P-{item.productId}
                    </Text>
                  </View>
                </View>
                
                {/* Actions */}
                <View className="flex-row gap-2 flex-1 justify-center">
                  <Pressable
                    onPress={() => router.push(`/order-item-form?id=${item.id}`)}
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
