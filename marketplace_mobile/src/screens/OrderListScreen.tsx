import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  Pressable,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
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
    <View className="bg-slate-900 m-3 rounded-lg border border-slate-700 p-4">
      {/* Header con ID y Status */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Text className="text-slate-400 text-xs">Order #</Text>
          <Text className="text-white text-lg font-bold ml-1">{item.id}</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor:
              item.paymentStatus === "Complete"
                ? "#16a34a"
                : item.paymentStatus === "Pending"
                ? "#ca8a04"
                : "#475569",
          }}
        >
          <Text className="text-white text-xs font-semibold">
            {item.paymentStatus || "N/A"}
          </Text>
        </View>
      </View>

      {/* User y Date */}
      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <Text className="text-slate-400 text-xs w-24">User:</Text>
          <Text className="text-white text-sm flex-1">{item.userName}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-slate-400 text-xs w-24">Date:</Text>
          <Text className="text-white text-sm">{item.orderDate}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-slate-700 my-3" />

      {/* Financial Info */}
      <View className="mb-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-400 text-xs">Subtotal:</Text>
          <Text className="text-white text-sm">{item.subtotal.toFixed(2)} {item.currency}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-slate-400 text-xs">Tax:</Text>
          <Text className="text-white text-sm">{item.tax.toFixed(2)} {item.currency}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-white text-sm font-bold">Total:</Text>
          <Text className="text-white text-lg font-bold">{item.totalAmount.toFixed(2)} {item.currency}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View className="flex-row items-center mb-3">
        <Text className="text-slate-400 text-xs w-24">Payment:</Text>
        <Text className="text-white text-sm">{item.payMethod}</Text>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2 mt-2">
        <Pressable
          onPress={() => router.push(`/order-form?id=${item.id}`)}
          className="flex-1 bg-yellow-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Edit Order</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(item.id)}
          className="flex-1 bg-red-600 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-slate-900 border-b border-slate-700">
        <Text className="text-2xl font-bold text-white">Orders</Text>
        <Pressable
          onPress={() => router.push("/order-form")}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Add Order</Text>
        </Pressable>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <EmptyState
            message="No orders found"
            description="Create your first order"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default OrderListScreen;
