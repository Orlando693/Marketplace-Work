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
import { getAllUsers, User } from "../services/userService";
import { Input, Button, Loading, Select, SearchableSelect } from "../components/ui";

export default function StoreFormScreen() {
  const params = useLocalSearchParams();
  const storeId = params.id ? Number(params.id) : null;
  const isEditing = !!storeId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [userId, setUserId] = useState<number | string>("");
  const [selectedUserName, setSelectedUserName] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    category: "",
    userId: "",
  });

  const categories = [
    { label: "-- Seleccionar Categoría --", value: "" },
    { label: "Electrónica", value: "Electronics" },
    { label: "Ropa", value: "Clothing" },
    { label: "Libros", value: "Books" },
    { label: "Comida", value: "Food" },
    { label: "Muebles", value: "Furniture" },
    { label: "Juguetes", value: "Toys" },
    { label: "Deportes", value: "Sports" },
    { label: "Belleza", value: "Beauty" },
    { label: "Salud", value: "Health" },
  ];

  useEffect(() => {
    loadUsers();
    if (isEditing) {
      fetchStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      const usersArray = (res.data as any)?.data || res.data;
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    }
  };

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await getStore(storeId!);
      const store = res.data;
      setName(store.name);
      setDescription(store.description);
      setCategory(store.category);
      setIsActive(store.isActive);
      setUserId(store.userId);
      
      // Find and set selected user name
      const user = users.find(u => u.id === store.userId);
      if (user) {
        setSelectedUserName(`${user.firstName} ${user.lastName}`);
      }
    } catch {
      Alert.alert("Error", "No se pudo cargar la tienda");
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
      newErrors.name = "El nombre de la tienda es requerido";
    }
    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (!category.trim()) {
      newErrors.category = "La categoría es requerida";
    }
    if (!userId.trim() || isNaN(Number(userId)) || Number(userId) <= 0) {
      newErrors.userId = "El propietario es requerido";
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
        Alert.alert("Éxito", "Tienda actualizada exitosamente");
      } else {
        await addStore(payload);
        Alert.alert("Éxito", "Tienda creada exitosamente");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo guardar la tienda. Por favor verifica los datos."
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

  if (loading) return <Loading text="Cargando tienda..." />;

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
            {isEditing ? "Editar Tienda" : "Nueva Tienda"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modificar información de la tienda" 
              : "Ingresar información de la nueva tienda"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Basic Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              🏪 Información de la Tienda
            </Text>
          </View>

          <Input
            label="Nombre de la Tienda"
            placeholder="ej., Paraíso Tecnológico"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Input
            label="Descripción"
            placeholder="Describe tu tienda..."
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
            label="Categoría"
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
                Categoría: {category}
              </Text>
            </View>
          )}

          {/* Status Section */}
          <View className="mb-6 mt-4">
            <Text className="text-lg font-bold text-slate-700 mb-3">
              📊 Estado de la Tienda
            </Text>
            <View className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-slate-800 font-semibold mb-1">
                    Tienda Activa
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {isActive 
                      ? "La tienda está abierta al público" 
                      : "La tienda está temporalmente cerrada"}
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

          {/* Owner Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              👤 Información del Propietario
            </Text>
          </View>

          <SearchableSelect
            label="Propietario de la Tienda"
            value={userId}
            onSelect={(id, label) => {
              setUserId(id);
              setSelectedUserName(label);
              setErrors({ ...errors, userId: "" });
            }}
            options={users.map(user => ({
              id: user.id,
              label: `${user.firstName} ${user.lastName}`,
              subtitle: `${user.email} • ${user.phone}`,
            }))}
            placeholder="Seleccionar propietario"
            error={errors.userId}
            icon="person-outline"
          />

          {/* Preview Card */}
          {name && category && (
            <View className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 rounded-lg border border-slate-300 mt-4">
              <Text className="text-slate-700 font-semibold mb-2">Vista Previa:</Text>
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
                    {isActive ? "ABIERTA" : "CERRADA"}
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
