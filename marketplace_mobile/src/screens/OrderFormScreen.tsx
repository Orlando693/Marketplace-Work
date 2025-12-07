import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  addOrder,
  updateOrder,
  getOrder,
  OrderRequest,
} from "../services/orderService";
import { getAllUsers, User } from "../services/userService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Loading from "../components/ui/Loading";

const OrderFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<OrderRequest>({
    subtotal: 0,
    totalAmount: 0,
    tax: 0,
    currency: "",
    payMethod: "",
    paymentStatus: "",
    userId: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
    if (isEditing) {
      loadOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      const usersArray = (res.data as any)?.data || res.data;
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Could not load users");
    }
  };

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrder(Number(id));
      const orderData = (res.data as any)?.data || res.data;
      setFormData({
        subtotal: orderData.subtotal || 0,
        totalAmount: orderData.totalAmount || 0,
        tax: orderData.tax || 0,
        currency: orderData.currency || "",
        payMethod: orderData.payMethod || "",
        paymentStatus: orderData.paymentStatus || "",
        userId: orderData.userId || 0,
      });
    } catch (error) {
      console.error("Error loading order:", error);
      Alert.alert("Error", "Could not load order");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.subtotal === undefined || formData.subtotal < 0) {
      newErrors.subtotal = "Subtotal must be 0 or greater";
    }

    if (formData.totalAmount === undefined || formData.totalAmount < 0) {
      newErrors.totalAmount = "Total amount must be 0 or greater";
    }

    if (formData.tax === undefined || formData.tax < 0) {
      newErrors.tax = "Tax must be 0 or greater";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.payMethod) {
      newErrors.payMethod = "Payment method is required";
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Payment status is required";
    }

    if (!formData.userId || formData.userId === 0) {
      newErrors.userId = "User is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const payload: OrderRequest = {
        subtotal: Number(formData.subtotal),
        totalAmount: Number(formData.totalAmount),
        tax: Number(formData.tax),
        currency: formData.currency,
        payMethod: formData.payMethod,
        paymentStatus: formData.paymentStatus,
        userId: Number(formData.userId),
      };

      if (isEditing) {
        await updateOrder(Number(id), payload);
        Alert.alert("Success", "Order updated successfully");
      } else {
        await addOrder(payload);
        Alert.alert("Success", "Order created successfully");
      }
      router.back();
    } catch (error: any) {
      console.error("Error saving order:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save order";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <Loading />;
  }

  const currencyOptions = [
    { label: "Bolivianos", value: "Bs" },
    { label: "Dolares Estadounidenses", value: "USD" },
    { label: "Euros", value: "Eur" },
  ];

  const paymentMethodOptions = [
    { label: "Visa", value: "Visa" },
    { label: "MasterCard", value: "MasterCard" },
    { label: "Paypal", value: "Paypal" },
  ];

  const paymentStatusOptions = [
    { label: "Null", value: "" },
    { label: "Completed", value: "Complete" },
    { label: "Pending", value: "Pending" },
  ];

  const userOptions = users.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-200">
        <View className="h-12" />
        <View className="px-4 pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="bg-slate-100 p-2.5 rounded-lg active:bg-slate-200"
            >
              <Ionicons name="arrow-back" size={22} color="#334155" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-800">
                {isEditing ? "Edit Order" : "Create Order"}
              </Text>
              <Text className="text-slate-500 text-sm mt-0.5">
                {isEditing ? "Update order information" : "Fill in the order details"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="space-y-4">
          <View>
            <Input
              label="Subtotal *"
              value={formData.subtotal.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, subtotal: parseFloat(text) || 0 })
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.subtotal}
            />
          </View>

          <View>
            <Input
              label="Total Amount *"
              value={formData.totalAmount.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, totalAmount: parseInt(text) || 0 })
              }
              placeholder="0"
              keyboardType="numeric"
              error={errors.totalAmount}
            />
          </View>

          <View>
            <Input
              label="Tax *"
              value={formData.tax.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, tax: parseFloat(text) || 0 })
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.tax}
            />
          </View>

          <View>
            <Select
              label="Currency"
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              options={currencyOptions}
              placeholder="Select Currency"
              error={errors.currency}
            />
          </View>

          <View>
            <Select
              label="Payment Method"
              value={formData.payMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, payMethod: value })
              }
              options={paymentMethodOptions}
              placeholder="Select Payment Method"
              error={errors.payMethod}
            />
          </View>

          <View>
            <Select
              label="Payment Status"
              value={formData.paymentStatus}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentStatus: value })
              }
              options={paymentStatusOptions}
              placeholder="Select Payment Status"
              error={errors.paymentStatus}
            />
          </View>

          <View>
            <Select
              label="User"
              value={formData.userId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: Number(value) })
              }
              options={userOptions}
              placeholder="Select User"
              error={errors.userId}
            />
          </View>

            <View className="flex-row gap-2 mt-6">
              <View className="flex-1">
                <Button
                  title={isEditing ? "Update Order" : "Create Order"}
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Cancel"
                  onPress={() => router.back()}
                  variant="secondary"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OrderFormScreen;
