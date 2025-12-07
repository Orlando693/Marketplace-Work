// src/screens/UserListScreen.tsx
import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAllUsers, deleteUser, User } from "../services/userService";
import { Loading, EmptyState } from "../components/ui";

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Recargar usuarios cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      console.log("=== API Response ===");
      console.log("Full response:", JSON.stringify(res.data, null, 2));
      
      // El backend devuelve ApiResponse con estructura:
      // { success: true, message: "...", data: [...], timestamp: "..." }
      const responseData = res.data as any;
      
      let usersArray: User[] = [];
      
      if (responseData && typeof responseData === 'object') {
        // Si tiene el campo 'data', es un ApiResponse wrapper
        if ('data' in responseData && Array.isArray(responseData.data)) {
          usersArray = responseData.data;
          console.log("✅ Extracted from ApiResponse.data:", usersArray.length, "users");
        } 
        // Si es directamente un array
        else if (Array.isArray(responseData)) {
          usersArray = responseData;
          console.log("✅ Direct array response:", usersArray.length, "users");
        }
      }
      
      setUsers(usersArray);
      console.log("📊 Users set in state:", usersArray.length);
    } catch (error: any) {
      console.error("❌ Error loading users:", error);
      console.error("Error details:", error.response?.data || error.message);
      Alert.alert("Error", "Could not load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to permanently delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(id);
              Alert.alert("Success", "User deleted successfully");
              loadUsers();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete user");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  if (loading) return <Loading text="Loading users..." />;

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
              <Text className="text-2xl font-bold text-slate-800">Users</Text>
              <Text className="text-slate-600 mt-0.5">
                {users.length} {users.length === 1 ? "user" : "users"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/user-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Card List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="No users"
            description="No users registered. Create one to get started."
            actionLabel="Add User"
            onAction={() => router.push("/user-form")}
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
                  <Ionicons name="person-circle-outline" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-xs text-slate-500 uppercase tracking-wide">User #{item.id}</Text>
                  <Text className="text-lg font-bold text-slate-800 mt-0.5">
                    {item.firstName} {item.lastName}
                  </Text>
                </View>
              </View>
              <View
                className={`px-3 py-1.5 rounded-lg ${
                  item.role === "ROLE_ADMIN" ? "bg-purple-100" : "bg-slate-100"
                }`}
              >
                <Text className={`text-xs font-bold ${
                  item.role === "ROLE_ADMIN" ? "text-purple-700" : "text-slate-700"
                }`}>
                  {item.role.replace("ROLE_", "")}
                </Text>
              </View>
            </View>

            {/* Contact Info */}
            <View className="mb-4 space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={16} color="#64748b" />
                <Text className="text-slate-600 ml-2 text-sm flex-1" numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={16} color="#64748b" />
                <Text className="text-slate-600 ml-2 text-sm flex-1">
                  {item.phone}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text className="text-slate-600 ml-2 text-sm flex-1">
                  {item.address}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => router.push(`/user-form?id=${item.id}`)}
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
