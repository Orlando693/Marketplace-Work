// src/screens/ProductFormScreen.tsx
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
import { addProduct, getProduct, updateProduct } from "../services/productService";
import { Input, Button, Loading } from "../components/ui";

export default function ProductFormScreen() {
  const params = useLocalSearchParams();
  const productId = params.id ? Number(params.id) : null;
  const isEditing = !!productId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    storeId: "",
    storeName: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProduct(productId!);
      const product = res.data;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setIsAvailable(product.isAvailable);
      setStoreId(product.storeId.toString());
      setStoreName(product.storeName || "");
    } catch {
      Alert.alert("Error", "Could not load product");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      description: "",
      price: "",
      stock: "",
      storeId: "",
      storeName: "",
    };

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "Stock must be a valid number";
    }
    if (!storeId.trim() || isNaN(Number(storeId)) || Number(storeId) <= 0) {
      newErrors.storeId = "Store ID is required";
    }
    if (!storeName.trim()) {
      newErrors.storeName = "Store name is required";
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
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        isAvailable: isAvailable,
        storeId: parseInt(storeId, 10),
        storeName: storeName.trim(),
      };

      if (isEditing) {
        await updateProduct(productId!, payload);
        Alert.alert("Success", "Product updated successfully");
      } else {
        await addProduct(payload);
        Alert.alert("Success", "Product created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Could not save product. Please verify the data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStockStatus = () => {
    const stockNum = parseInt(stock || "0", 10);
    if (stockNum === 0) return { label: "Out of Stock", color: "danger" };
    if (stockNum < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  if (loading) return <Loading text="Loading product..." />;

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
            {isEditing ? "Edit Product" : "New Product"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modify product information" 
              : "Enter new product information"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Basic Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              📦 Product Information
            </Text>
          </View>

          <Input
            label="Product Name"
            placeholder="e.g., iPhone 15 Pro"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Input
            label="Description"
            placeholder="Describe the product..."
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

          {/* Pricing Section */}
          <View className="mb-6 mt-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              💰 Pricing & Inventory
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Price ($)"
                placeholder="0.00"
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  setErrors({ ...errors, price: "" });
                }}
                error={errors.price}
                keyboardType="decimal-pad"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Stock"
                placeholder="0"
                value={stock}
                onChangeText={(text) => {
                  setStock(text);
                  setErrors({ ...errors, stock: "" });
                }}
                error={errors.stock}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Stock Status Preview */}
          {stock && (
            <View className="mb-4">
              <View
                className={`px-3 py-2 rounded-lg ${
                  getStockStatus().color === "success"
                    ? "bg-success-100"
                    : getStockStatus().color === "warning"
                    ? "bg-warning-100"
                    : "bg-danger-100"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    getStockStatus().color === "success"
                      ? "text-success-700"
                      : getStockStatus().color === "warning"
                      ? "text-warning-700"
                      : "text-danger-700"
                  }`}
                >
                  {getStockStatus().label}: {stock} units
                </Text>
              </View>
            </View>
          )}

          {/* Availability Switch */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-3">
              📊 Availability Status
            </Text>
            <View className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-slate-800 font-semibold mb-1">
                    Available for Sale
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {isAvailable 
                      ? "Product is available for customers" 
                      : "Product is hidden from customers"}
                  </Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: "#cbd5e1", true: "#22c55e" }}
                  thumbColor={isAvailable ? "#ffffff" : "#f4f4f5"}
                />
              </View>
            </View>
          </View>

          {/* Store Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              🏪 Store Information
            </Text>
          </View>

          <Input
            label="Store ID"
            placeholder="e.g., 1"
            value={storeId}
            onChangeText={(text) => {
              setStoreId(text);
              setErrors({ ...errors, storeId: "" });
            }}
            error={errors.storeId}
            keyboardType="number-pad"
          />

          <Input
            label="Store Name"
            placeholder="e.g., Tech Paradise"
            value={storeName}
            onChangeText={(text) => {
              setStoreName(text);
              setErrors({ ...errors, storeName: "" });
            }}
            error={errors.storeName}
          />

          {/* Preview Card */}
          {name && price && (
            <View className="bg-gradient-to-r from-warning-50 to-amber-50 p-4 rounded-lg border border-warning-200 mt-4">
              <Text className="text-slate-700 font-semibold mb-2">Preview:</Text>
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-lg mb-1">
                    {name}
                  </Text>
                  {storeName && (
                    <Text className="text-slate-600 text-sm mb-2">
                      🏪 {storeName}
                    </Text>
                  )}
                  {description && (
                    <Text className="text-slate-700 text-sm" numberOfLines={2}>
                      {description}
                    </Text>
                  )}
                </View>
                <View className="ml-3">
                  <Text className="text-success-600 font-bold text-2xl">
                    ${parseFloat(price || "0").toFixed(2)}
                  </Text>
                  {stock && (
                    <Text className="text-slate-500 text-xs text-right mt-1">
                      Stock: {stock}
                    </Text>
                  )}
                </View>
              </View>
              <View className="flex-row gap-2 mt-3">
                <View
                  className={`px-3 py-1 rounded-full ${
                    isAvailable ? "bg-success-500" : "bg-danger-500"
                  }`}
                >
                  <Text className="text-white text-xs font-bold">
                    {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                  </Text>
                </View>
                {stock && (
                  <View
                    className={`px-3 py-1 rounded-full ${
                      getStockStatus().color === "success"
                        ? "bg-success-500"
                        : getStockStatus().color === "warning"
                        ? "bg-warning-500"
                        : "bg-danger-500"
                    }`}
                  >
                    <Text className="text-white text-xs font-bold">
                      {getStockStatus().label.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
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
