// src/screens/UserFormScreen.tsx
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
import { addUser, getUser, updateUser } from "../services/UserService";
import { Input, Button, Loading } from "../components/ui";

export default function UserFormScreen() {
  const params = useLocalSearchParams();
  const userId = params.id ? Number(params.id) : null;
  const isEditing = !!userId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUser(userId!);
      const user = res.data;
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setPassword(user.password);
      setRole(user.role || "ROLE_USER");
    } catch (error) {
      Alert.alert("Error", "Could not load user");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      role: "",
    };

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!isEditing && !password.trim()) newErrors.password = "Password is required";
    if (!role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        password: password,
        role: role,
      };

      if (isEditing) {
        await updateUser(userId!, payload);
        Alert.alert("Success", "User updated successfully");
      } else {
        await addUser(payload);
        Alert.alert("Success", "User created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Could not save user. Please verify the data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading user..." />;

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
            {isEditing ? "Edit User" : "New User"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing ? "Modify user information" : "Enter new user information"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <Input
            label="First Name"
            placeholder="e.g., John"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors({ ...errors, firstName: "" });
            }}
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            placeholder="e.g., Doe"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors({ ...errors, lastName: "" });
            }}
            error={errors.lastName}
          />

          <Input
            label="Email"
            placeholder="e.g., john@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: "" });
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone"
            placeholder="e.g., +1234567890"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors({ ...errors, phone: "" });
            }}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <Input
            label="Address"
            placeholder="e.g., 123 Main St"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors({ ...errors, address: "" });
            }}
            error={errors.address}
          />

          {!isEditing && (
            <Input
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
              error={errors.password}
              secureTextEntry
            />
          )}

          <Input
            label="Role"
            placeholder="ROLE_USER or ROLE_ADMIN"
            value={role}
            onChangeText={(text) => {
              setRole(text);
              setErrors({ ...errors, role: "" });
            }}
            error={errors.role}
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
