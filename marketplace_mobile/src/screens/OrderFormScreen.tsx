import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
      const order = res.data;
      setFormData({
        tax: order.tax,
        currency: order.currency,
        payMethod: order.payMethod,
        paymentStatus: order.paymentStatus,
        userId: order.userId,
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

    if (!formData.tax || formData.tax < 0) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-950"
    >
      <ScrollView className="flex-1 p-4" style={{ paddingBottom: 100 }}>
        <Text className="text-2xl font-bold text-white mb-6">
          {isEditing ? "Edit Order" : "Add Order"}
        </Text>

        <View className="space-y-4">
          <View>
            <Input
              label="Tax"
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
                title={isEditing ? "Update" : "Create"}
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
  );
};

export default OrderFormScreen;
