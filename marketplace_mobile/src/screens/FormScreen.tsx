// src/screens/FormScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "../services/api";
import { Input, Button, Loading } from "../components/ui";

export default function FormScreen() {
  const params = useLocalSearchParams();
  const productId = params.id ? Number(params.id) : null;
  const isEditing = !!productId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${productId}`);
      const product = res.data;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
    } catch (error) {
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
    };

    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim())
      newErrors.description = "Description is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "Enter a valid price";
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0)
      newErrors.stock = "Enter a valid stock";

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
      };

      if (isEditing) {
        await api.put(`/products/${productId}`, payload);
        Alert.alert("Success", "Product updated successfully");
      } else {
        await api.post("/products", payload);
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

  if (loading) return <Loading text="Loading product..." />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
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
          <Input
            label="Product Name"
            placeholder="e.g., HP Laptop"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Input
            label="Description"
            placeholder="Describe the product"
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

          <Input
            label="Price"
            placeholder="0.00"
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              setErrors({ ...errors, price: "" });
            }}
            error={errors.price}
            keyboardType="decimal-pad"
          />

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

          <View className="flex-row gap-3 mt-4">
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
