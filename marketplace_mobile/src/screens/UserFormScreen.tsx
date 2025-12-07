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
import { addUser, getUser, updateUser } from "../services/userService";
import { Input, Button, Loading, Select } from "../components/ui";

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
  const [role, setRole] = useState("ROLE_USER");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUser(userId!);
      // Handle ApiResponse wrapper from backend
      const user = (res.data as any)?.data || res.data;
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setRole(user.role || "ROLE_USER");
    } catch {
      Alert.alert("Error", "No se pudo cargar el usuario");
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
      role: "",
    };

    if (!firstName.trim()) newErrors.firstName = "El nombre es requerido";
    if (!lastName.trim()) newErrors.lastName = "El apellido es requerido";
    if (!email.trim()) newErrors.email = "El correo electrónico es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Formato de correo inválido";
    if (!phone.trim()) newErrors.phone = "El teléfono es requerido";
    else if (!/^\d{8}$/.test(phone.trim())) newErrors.phone = "El teléfono debe tener exactamente 8 dígitos";
    if (!address.trim()) newErrors.address = "La dirección es requerida";
    if (!role.trim()) newErrors.role = "El rol es requerido";

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
        role: role,
      };

      if (isEditing) {
        const response = await updateUser(userId!, payload);
        console.log("✅ User updated:", response.data);
        Alert.alert("Éxito", "Usuario actualizado exitosamente");
      } else {
        const response = await addUser(payload);
        console.log("✅ User created:", response.data);
        Alert.alert("Éxito", "Usuario creado exitosamente", [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]);
        return; // No hacer router.back() automáticamente
      }

      router.back();
    } catch (error: any) {
      console.error("❌ Error saving user:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error message:", error?.message);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo guardar el usuario. Por favor verifica los datos.";
      
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Cargando usuario..." />;

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
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing ? "Modificar información del usuario" : "Ingresar información del nuevo usuario"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <Input
            label="Nombre"
            placeholder="ej., Juan"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors({ ...errors, firstName: "" });
            }}
            error={errors.firstName}
          />

          <Input
            label="Apellido"
            placeholder="ej., Pérez"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors({ ...errors, lastName: "" });
            }}
            error={errors.lastName}
          />

          <Input
            label="Correo Electrónico"
            placeholder="ej., juan@ejemplo.com"
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
            label="Teléfono (8 dígitos)"
            placeholder="ej., 12345678"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors({ ...errors, phone: "" });
            }}
            error={errors.phone}
            keyboardType="number-pad"
            maxLength={8}
          />

          <Input
            label="Dirección"
            placeholder="ej., Calle Principal 123"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors({ ...errors, address: "" });
            }}
            error={errors.address}
          />

          <Select
            label="Rol"
            value={role}
            onValueChange={(value) => {
              setRole(value);
              setErrors({ ...errors, role: "" });
            }}
            options={[
              { label: "-- Seleccionar Rol --", value: "" },
              { label: "ADMINISTRADOR", value: "ROLE_ADMIN" },
              { label: "USUARIO", value: "ROLE_USER" },
            ]}
            error={errors.role}
          />

          <View className="flex-row gap-3 mt-4 mb-6">
            <View className="flex-1">
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => router.back()}
                disabled={submitting}
              />
            </View>
            <View className="flex-1">
              <Button
                title={isEditing ? "Actualizar" : "Crear"}
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
