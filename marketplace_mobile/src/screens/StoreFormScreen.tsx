// src/screens/StoreFormScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { addStore, getStore, updateStore } from "../services/storeService";
import { Input, Button, Loading, Select } from "../components/ui";

export default function StoreFormScreen() {
  const params = useLocalSearchParams();
  const storeId = params.id ? Number(params.id) : null;
  const isEditing = !!storeId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [userId, setUserId] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    userId: "",
  });

  const categories = [
    { label: "-- Select Category --", value: "" },
    { label: "Electronics", value: "Electronics" },
    { label: "Clothing", value: "Clothing" },
    { label: "Books", value: "Books" },
    { label: "Food", value: "Food" },
    { label: "Furniture", value: "Furniture" },
    { label: "Toys", value: "Toys" },
    { label: "Sports", value: "Sports" },
    { label: "Beauty", value: "Beauty" },
    { label: "Health", value: "Health" },
  ];

  useEffect(() => {
    if (isEditing) {
      fetchStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await getStore(storeId!);
      const store = res.data;
      setName(store.name);
      setDescription(store.description);
      setCategory(store.category);
      setIsActive(store.isActive);
      setUserId(store.userId.toString());
    } catch {
      Alert.alert("Error", "Could not load store");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      description: "",
      category: "",
      userId: "",
    };

    if (!name.trim()) {
      newErrors.name = "Store name is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!userId.trim() || isNaN(Number(userId)) || Number(userId) <= 0) {
      newErrors.userId = "User ID is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category,
        isActive: isActive,
        userId: parseInt(userId, 10),
      };

      if (isEditing) {
        await updateStore(storeId!, payload);
        Alert.alert("Success", "Store updated successfully");
      } else {
        await addStore(payload);
        Alert.alert("Success", "Store created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Could not save store. Please verify the data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
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
    return icons[cat] || "🏪";
  };

  if (loading) return <Loading text="Loading store..." />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-slate-800">
            {isEditing ? "Edit Store" : "New Store"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modify store information" 
              : "Enter new store information"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Basic Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              🏪 Store Information
            </Text>
          </View>

          <Input
            label="Store Name"
            placeholder="e.g., Tech Paradise"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Input
            label="Description"
            placeholder="Describe your store..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors({ ...errors, description: "" });
            }}
            error={errors.description}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: "top" }}
          />

          <Select
            label="Category"
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setErrors({ ...errors, category: "" });
            }}
            options={categories}
            error={errors.category}
          />

          {/* Preview Category */}
          {category && (
            <View className="bg-slate-100 p-3 rounded-lg mb-4 flex-row items-center gap-2">
              <Text className="text-2xl">{getCategoryIcon(category)}</Text>
              <Text className="text-slate-700 font-semibold">
                Category: {category}
              </Text>
            </View>
          )}

          {/* Status Section */}
          <View className="mb-6 mt-4">
            <Text className="text-lg font-bold text-slate-700 mb-3">
              📊 Store Status
            </Text>
            <View className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-slate-800 font-semibold mb-1">
                    Store Active
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {isActive 
                      ? "Store is currently open for business" 
                      : "Store is temporarily closed"}
                  </Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: "#cbd5e1", true: "#22c55e" }}
                  thumbColor={isActive ? "#ffffff" : "#f4f4f5"}
                />
              </View>
            </View>
          </View>

          {/* User ID Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              👤 Owner Information
            </Text>
          </View>

          <Input
            label="User ID (Store Owner)"
            placeholder="e.g., 1"
            value={userId}
            onChangeText={(text) => {
              setUserId(text);
              setErrors({ ...errors, userId: "" });
            }}
            error={errors.userId}
            keyboardType="number-pad"
          />

          {/* Preview Card */}
          {name && category && (
            <View className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 rounded-lg border border-slate-300 mt-4">
              <Text className="text-slate-700 font-semibold mb-2">Preview:</Text>
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-3xl">{getCategoryIcon(category)}</Text>
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-lg">
                    {name}
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {category}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    isActive ? "bg-success-500" : "bg-danger-500"
                  }`}
                >
                  <Text className="text-white text-xs font-bold">
                    {isActive ? "OPEN" : "CLOSED"}
                  </Text>
                </View>
              </View>
              {description && (
                <Text className="text-slate-700 text-sm" numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
          )}

          <View className="flex-row gap-3 mt-6 mb-6">
            <View className="flex-1">
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                disabled={submitting}
              />
            </View>
            <View className="flex-1">
              <Button
                title={isEditing ? "Update" : "Create"}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
