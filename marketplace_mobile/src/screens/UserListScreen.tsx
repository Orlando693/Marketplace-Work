// src/screens/UserListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAllUsers, deleteUser, User } from "../services/UserService";
import { Loading, EmptyState, Button } from "../components/ui";

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
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
        <Text className="text-2xl font-bold text-slate-800">User List</Text>
        <Text className="text-slate-600 mt-1">
          {users.length} {users.length === 1 ? "user" : "users"} registered
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-slate-200">
            {/* Header con nombre y rol */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800">
                  {item.firstName} {item.lastName}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full mt-1 self-start ${
                    item.role === "ROLE_ADMIN" ? "bg-primary-100" : "bg-slate-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      item.role === "ROLE_ADMIN" ? "text-primary-700" : "text-slate-700"
                    }`}
                  >
                    {item.role}
                  </Text>
                </View>
              </View>
              <Text className="text-slate-400 text-sm">#{item.id}</Text>
            </View>

            {/* Información de contacto */}
            <View className="space-y-2 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={18} color="#64748b" />
                <Text className="text-slate-600 ml-2">{item.email}</Text>
              </View>
              {item.phone && (
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={18} color="#64748b" />
                  <Text className="text-slate-600 ml-2">{item.phone}</Text>
                </View>
              )}
              {item.address && (
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={18} color="#64748b" />
                  <Text className="text-slate-600 ml-2">{item.address}</Text>
                </View>
              )}
            </View>

            {/* Botones de acción */}
            <View className="flex-row gap-2">
              <Button
                title="Edit"
                variant="outline"
                onPress={() => router.push(`/user-form?id=${item.id}`)}
              />
              <Button
                title="Delete"
                variant="danger"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* Botón flotante para agregar */}
      <Pressable
        onPress={() => router.push("/user-form")}
        className="absolute bottom-6 right-6 bg-primary-500 w-16 h-16 rounded-full items-center justify-center shadow-lg active:bg-primary-600"
      >
        <Text className="text-white text-3xl">+</Text>
      </Pressable>
    </View>
  );
}
