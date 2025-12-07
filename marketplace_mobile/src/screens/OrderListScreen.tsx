import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Pressable,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllOrders, deleteOrder, Order } from "../services/orderService";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";

const OrderListScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      console.log("API Response:", res);
      console.log("Orders data:", res.data);
      
      // Handle ApiResponse wrapper from backend
      const ordersArray = (res.data as any)?.data || res.data;
      console.log("Orders array:", ordersArray);
      
      setOrders(Array.isArray(ordersArray) ? ordersArray : []);
    } catch (error) {
      console.error("Error loading orders:", error);
      Alert.alert("Error", "Could not load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOrder(id);
              Alert.alert("Success", "Order deleted successfully");
              loadOrders();
            } catch (error) {
              console.error("Error deleting order:", error);
              Alert.alert("Error", "Failed to delete order");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-slate-200">
      {/* Header de la Card con ID y Status */}
      <View className="flex-row justify-between items-center bg-slate-50 px-4 py-2 border-b border-slate-200">
        <View className="flex-row items-center gap-1">
          <Ionicons name="receipt" size={14} color="#64748b" />
          <Text className="text-slate-500 text-xs font-medium">Order #{item.id}</Text>
        </View>
        <View
          className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${
            item.paymentStatus === "Complete"
              ? "bg-green-500"
              : item.paymentStatus === "Pending"
              ? "bg-yellow-500"
              : "bg-slate-500"
          }`}
        >
          <Ionicons 
            name={item.paymentStatus === "Complete" ? "checkmark-circle" : "time"} 
            size={12} 
            color="white" 
          />
          <Text className="text-white text-xs font-bold">
            {item.paymentStatus || "N/A"}
          </Text>
        </View>
      </View>

      {/* Contenido de la Card */}
      <View className="p-4">
        {/* User y Date */}
        <View className="mb-3">
          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="person" size={14} color="#64748b" />
            <Text className="text-slate-500 text-xs font-medium">CUSTOMER</Text>
          </View>
          <Text className="text-slate-900 text-base font-semibold">{item.userName}</Text>
        </View>

        <View className="mb-3">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="calendar" size={14} color="#64748b" />
            <Text className="text-slate-500 text-xs font-medium">ORDER DATE</Text>
          </View>
          <Text className="text-slate-700 text-sm">{item.orderDate}</Text>
        </View>

        {/* Divider */}
        <View className="border-t border-slate-200 my-3" />

        {/* Financial Info */}
        <View className="mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-sm">Subtotal</Text>
            <Text className="text-slate-700 text-sm font-medium">{item.subtotal.toFixed(2)} {item.currency}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500 text-sm">Tax</Text>
            <Text className="text-slate-700 text-sm font-medium">{item.tax.toFixed(2)} {item.currency}</Text>
          </View>
          <View className="flex-row justify-between items-center pt-2 border-t border-slate-200">
            <Text className="text-slate-900 text-base font-bold">Total</Text>
            <Text className="text-primary-600 text-xl font-bold">{item.totalAmount.toFixed(2)} {item.currency}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-4">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="card" size={14} color="#64748b" />
            <Text className="text-slate-500 text-xs font-medium">PAYMENT METHOD</Text>
          </View>
          <Text className="text-slate-700 text-sm font-medium">{item.payMethod}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push(`/order-form?id=${item.id}`)}
            className="flex-1 bg-warning-500 py-2.5 rounded-lg active:bg-warning-600 flex-row justify-center items-center gap-2"
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text className="text-white font-semibold text-sm">Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            className="flex-1 bg-danger-500 py-2.5 rounded-lg active:bg-danger-600 flex-row justify-center items-center gap-2"
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text className="text-white font-semibold text-sm">Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

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
              <Text className="text-2xl font-bold text-slate-800">Orders</Text>
              <Text className="text-slate-600 mt-0.5">
                {orders.length} {orders.length === 1 ? "order" : "orders"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/order-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Card List */}
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon="📦"
            title="No orders"
            description="No orders found. Create your first order."
            actionLabel="Add Order"
            onAction={() => router.push("/order-form")}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export default OrderListScreen;
