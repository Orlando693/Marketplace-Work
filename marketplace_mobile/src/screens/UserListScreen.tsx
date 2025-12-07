// src/screens/UserListScreen.tsx
import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
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

  if (users.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No users"
        description="No users registered. Create one to get started."
        actionLabel="Add User"
        onAction={() => router.push("/user-form")}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-slate-800">User List</Text>
            <Text className="text-slate-600 mt-1">
              {users.length} {users.length === 1 ? "user" : "users"} registered
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/user-form")}
            className="bg-primary-500 px-4 py-2 rounded-lg active:bg-primary-600"
          >
            <Text className="text-white font-semibold">Add User</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabla */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View className="bg-slate-800 flex-row px-4 py-3">
            <Text className="text-white font-bold text-xs w-12">ID</Text>
            <Text className="text-white font-bold text-xs flex-1">Name</Text>
            <Text className="text-white font-bold text-xs flex-1">Email</Text>
            <Text className="text-white font-bold text-xs w-20">Phone</Text>
            <Text className="text-white font-bold text-xs w-24">Role</Text>
            <Text className="text-white font-bold text-xs w-32 text-center">Actions</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white flex-row px-4 py-3 border-b border-slate-200 items-center">
            {/* ID */}
            <Text className="text-slate-600 text-xs w-12">{item.id}</Text>
            
            {/* Name */}
            <View className="flex-1">
              <Text className="text-slate-800 font-semibold text-sm">
                {item.firstName} {item.lastName}
              </Text>
              <Text className="text-slate-500 text-xs">{item.address}</Text>
            </View>
            
            {/* Email */}
            <Text className="text-slate-600 text-xs flex-1" numberOfLines={1}>
              {item.email}
            </Text>
            
            {/* Phone */}
            <Text className="text-slate-600 text-xs w-20">{item.phone}</Text>
            
            {/* Role */}
            <View className="w-24">
              <View
                className={`px-2 py-1 rounded ${
                  item.role === "ROLE_ADMIN" ? "bg-primary-100" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold text-center ${
                    item.role === "ROLE_ADMIN" ? "text-primary-700" : "text-slate-700"
                  }`}
                  numberOfLines={1}
                >
                  {item.role.replace("ROLE_", "")}
                </Text>
              </View>
            </View>
            
            {/* Actions */}
            <View className="flex-row gap-1 w-32 justify-center">
              <Pressable
                onPress={() => router.push(`/user-form?id=${item.id}`)}
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
  );
}
