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
import { getAllStores, Store } from "../services/storeService";
import { Input, Button, Loading, SearchableSelect } from "../components/ui";

export default function ProductFormScreen() {
  const params = useLocalSearchParams();
  const productId = params.id ? Number(params.id) : null;
  const isEditing = !!productId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [storeId, setStoreId] = useState<number | string>("");
  const [storeName, setStoreName] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    storeId: "",
  });

  useEffect(() => {
    loadStores();
    if (isEditing) {
      fetchProduct();
    }
  }, [productId]);

  const loadStores = async () => {
    try {
      const res = await getAllStores();
      const storesArray = (res.data as any)?.data || res.data;
      setStores(Array.isArray(storesArray) ? storesArray : []);
    } catch (error) {
      console.error("Error loading stores:", error);
      Alert.alert("Error", "No se pudieron cargar las tiendas");
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await getProduct(productId!);
      const product = (res.data as any)?.data || res.data;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setIsAvailable(product.isAvailable);
      setStoreId(product.storeId.toString());
      
      const selectedStore = stores.find((s) => s.id === product.storeId);
      if (selectedStore) {
        setStoreName(selectedStore.name);
      }
    } catch {
      Alert.alert("Error", "No se pudo cargar el producto");
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
    };

    if (!name.trim()) {
      newErrors.name = "El nombre del producto es requerido";
    }
    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "El precio debe ser un número positivo";
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "El stock debe ser un número válido";
    }
    if (!storeId.toString().trim() || isNaN(Number(storeId)) || Number(storeId) <= 0) {
      newErrors.storeId = "La tienda es requerida";
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
        storeId: parseInt(storeId.toString(), 10),
        storeName: storeName.trim(),
      };

      if (isEditing) {
        await updateProduct(productId!, payload);
        Alert.alert("Éxito", "Producto actualizado exitosamente");
      } else {
        await addProduct(payload);
        Alert.alert("Éxito", "Producto creado exitosamente");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo guardar el producto. Por favor verifica los datos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStockStatus = () => {
    const stockNum = parseInt(stock || "0", 10);
    if (stockNum === 0) return { label: "Sin Stock", color: "danger" };
    if (stockNum < 10) return { label: "Stock Bajo", color: "warning" };
    return { label: "En Stock", color: "success" };
  };

  if (loading) return <Loading text="Cargando producto..." />;

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
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modificar información del producto" 
              : "Ingresar información del nuevo producto"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Basic Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Informacion del Producto
            </Text>
          </View>

          <Input
            label="Nombre del Producto"
            placeholder="e.g., iPhone 15 Pro"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: "" });
            }}
            error={errors.name}
          />

          <Input
            label="Descripción"
            placeholder="Describe el producto..."
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
              Precio e Inventario
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="Precio ($)"
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
                  {getStockStatus().label}: {stock} unidades
                </Text>
              </View>
            </View>
          )}

          {/* Availability Switch */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-3">
              Estado de Disponibilidad
            </Text>
            <View className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-slate-800 font-semibold mb-1">
                    Disponible para Venta
                  </Text>
                  <Text className="text-slate-600 text-sm">
                    {isAvailable 
                      ? "El producto está disponible para clientes" 
                      : "El producto está oculto para clientes"}
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
              Informacion de la Tienda
            </Text>
          </View>

          <SearchableSelect
            label="Tienda"
            value={storeId}
            onSelect={(id) => {
              setStoreId(id);
              const selectedStore = stores.find((s) => s.id === Number(id));
              if (selectedStore) {
                setStoreName(selectedStore.name);
              }
              setErrors({ ...errors, storeId: "" });
            }}
            options={stores.map((store) => ({
              id: store.id,
              label: store.name,
              subtitle: `${store.category}${store.isActive ? " • Activa" : " • Inactiva"}`,
            }))}
            placeholder={storeName || "Seleccionar tienda"}
            error={errors.storeId}
            icon="storefront-outline"
          />

          {/* Preview Card */}
          {name && price && (
            <View className="bg-gradient-to-r from-warning-50 to-amber-50 p-4 rounded-lg border border-warning-200 mt-4">
              <Text className="text-slate-700 font-semibold mb-2">Vista Previa:</Text>
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
                    {isAvailable ? "DISPONIBLE" : "NO DISPONIBLE"}
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
