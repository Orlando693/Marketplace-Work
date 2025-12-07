// src/screens/OrderItemFormScreen.tsx
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
import { addOrderItem, getOrderItem, updateOrderItem } from "../services/orderItemService";
import { Input, Button, Loading } from "../components/ui";

export default function OrderItemFormScreen() {
  const params = useLocalSearchParams();
  const orderItemId = params.id ? Number(params.id) : null;
  const isEditing = !!orderItemId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");

  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
    subtotal: "",
    orderId: "",
    productId: "",
    productName: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchOrderItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItemId]);

  // Auto-calculate subtotal when quantity or price changes
  useEffect(() => {
    if (quantity && price) {
      const qty = parseFloat(quantity);
      const prc = parseFloat(price);
      if (!isNaN(qty) && !isNaN(prc)) {
        setSubtotal((qty * prc).toFixed(2));
      }
    }
  }, [quantity, price]);

  const fetchOrderItem = async () => {
    setLoading(true);
    try {
      const res = await getOrderItem(orderItemId!);
      const item = res.data;
      setQuantity(item.quantity.toString());
      setPrice(item.price.toString());
      setSubtotal(item.subtotal.toString());
      setOrderId(item.orderId.toString());
      setProductId(item.productId.toString());
      setProductName(item.productName || "");
    } catch {
      Alert.alert("Error", "Could not load order item");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      quantity: "",
      price: "",
      subtotal: "",
      orderId: "",
      productId: "",
      productName: "",
    };

    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!subtotal.trim() || isNaN(Number(subtotal)) || Number(subtotal) <= 0) {
      newErrors.subtotal = "Subtotal must be a positive number";
    }
    if (!orderId.trim() || isNaN(Number(orderId)) || Number(orderId) <= 0) {
      newErrors.orderId = "Order ID is required";
    }
    if (!productId.trim() || isNaN(Number(productId)) || Number(productId) <= 0) {
      newErrors.productId = "Product ID is required";
    }
    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        subtotal: parseFloat(subtotal),
        orderId: parseInt(orderId, 10),
        productId: parseInt(productId, 10),
        productName: productName.trim(),
      };

      if (isEditing) {
        await updateOrderItem(orderItemId!, payload);
        Alert.alert("Success", "Order item updated successfully");
      } else {
        await addOrderItem(payload);
        Alert.alert("Success", "Order item created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Could not save order item. Please verify the data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading order item..." />;

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
            {isEditing ? "Edit Order Item" : "New Order Item"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modify order item information" 
              : "Enter new order item information"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Product Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              📦 Product Information
            </Text>
          </View>

          <Input
            label="Product ID"
            placeholder="e.g., 1"
            value={productId}
            onChangeText={(text) => {
              setProductId(text);
              setErrors({ ...errors, productId: "" });
            }}
            error={errors.productId}
            keyboardType="number-pad"
          />

          <Input
            label="Product Name"
            placeholder="e.g., Laptop HP"
            value={productName}
            onChangeText={(text) => {
              setProductName(text);
              setErrors({ ...errors, productName: "" });
            }}
            error={errors.productName}
          />

          {/* Order Info Section */}
          <View className="mb-4 mt-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              🛒 Order Details
            </Text>
          </View>

          <Input
            label="Order ID"
            placeholder="e.g., 5"
            value={orderId}
            onChangeText={(text) => {
              setOrderId(text);
              setErrors({ ...errors, orderId: "" });
            }}
            error={errors.orderId}
            keyboardType="number-pad"
          />

          <Input
            label="Quantity"
            placeholder="e.g., 2"
            value={quantity}
            onChangeText={(text) => {
              setQuantity(text);
              setErrors({ ...errors, quantity: "" });
            }}
            error={errors.quantity}
            keyboardType="number-pad"
          />

          <Input
            label="Price (per unit)"
            placeholder="e.g., 999.99"
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              setErrors({ ...errors, price: "" });
            }}
            error={errors.price}
            keyboardType="decimal-pad"
          />

          <Input
            label="Subtotal (auto-calculated)"
            placeholder="0.00"
            value={subtotal}
            onChangeText={(text) => {
              setSubtotal(text);
              setErrors({ ...errors, subtotal: "" });
            }}
            error={errors.subtotal}
            keyboardType="decimal-pad"
            editable={false}
          />

          {/* Preview */}
          {quantity && price && subtotal && (
            <View className="bg-success-50 p-4 rounded-lg border border-success-200 mt-4">
              <Text className="text-success-800 font-semibold text-center text-lg">
                Total: {quantity} × ${price} = ${subtotal}
              </Text>
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
