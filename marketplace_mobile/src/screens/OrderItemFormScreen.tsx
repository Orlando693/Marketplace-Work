// src/screens/OrderItemFormScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addOrderItem, getOrderItem, updateOrderItem } from "../services/orderItemService";
import { getAllOrders, Order } from "../services/orderService";
import { getAllProducts, Product } from "../services/productService";
import { Input, Button, Loading, SearchableSelect } from "../components/ui";

export default function OrderItemFormScreen() {
  const params = useLocalSearchParams();
  const orderItemId = params.id ? Number(params.id) : null;
  const isEditing = !!orderItemId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [orderId, setOrderId] = useState<number | string>("");
  const [productId, setProductId] = useState<number | string>("");
  const [productName, setProductName] = useState("");
  const [orderInfo, setOrderInfo] = useState("");

  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
    subtotal: "",
    orderId: "",
    productId: "",
  });

  useEffect(() => {
    loadOrders();
    loadProducts();
    if (isEditing) {
      fetchOrderItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItemId]);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      const ordersArray = (res.data as any)?.data || res.data;
      setOrders(Array.isArray(ordersArray) ? ordersArray : []);
    } catch (error) {
      console.error("Error loading orders:", error);
      Alert.alert("Error", "No se pudieron cargar las órdenes");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      const productsArray = (res.data as any)?.data || res.data;
      setProducts(Array.isArray(productsArray) ? productsArray : []);
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert("Error", "No se pudieron cargar los productos");
    }
  };

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
      // Handle ApiResponse wrapper from backend
      const item = (res.data as any)?.data || res.data;
      setQuantity(item.quantity.toString());
      setPrice(item.price.toString());
      setSubtotal(item.subtotal.toString());
      setOrderId(item.orderId.toString());
      setProductId(item.productId.toString());
      
      // Set order and product info from loaded arrays
      const selectedOrder = orders.find((o) => o.id === item.orderId);
      if (selectedOrder) {
        setOrderInfo(`Order #${selectedOrder.id} - $${selectedOrder.totalAmount}`);
      }
      
      const selectedProduct = products.find((p) => p.id === item.productId);
      if (selectedProduct) {
        setProductName(selectedProduct.name);
      }
    } catch {
      Alert.alert("Error", "No se pudo cargar el ítem de la orden");
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
    };

    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser un número positivo";
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "El precio debe ser un número positivo";
    }
    if (!subtotal.trim() || isNaN(Number(subtotal)) || Number(subtotal) <= 0) {
      newErrors.subtotal = "El subtotal debe ser un número positivo";
    }
    if (!orderId.toString().trim() || isNaN(Number(orderId)) || Number(orderId) <= 0) {
      newErrors.orderId = "La orden es requerida";
    }
    if (!productId.toString().trim() || isNaN(Number(productId)) || Number(productId) <= 0) {
      newErrors.productId = "El producto es requerido";
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
        orderId: parseInt(orderId.toString(), 10),
        productId: parseInt(productId.toString(), 10),
        productName: productName.trim(),
      };

      if (isEditing) {
        await updateOrderItem(orderItemId!, payload);
        Alert.alert("Éxito", "Ítem de orden actualizado exitosamente");
      } else {
        await addOrderItem(payload);
        Alert.alert("Éxito", "Ítem de orden creado exitosamente");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo guardar el ítem de la orden. Por favor verifica los datos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Cargando ítem de orden..." />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Modern Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 p-2 rounded-full bg-slate-100 active:bg-slate-200"
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-slate-800">
              {isEditing ? "Editar Ítem de Orden" : "Nuevo Ítem de Orden"}
            </Text>
            <Text className="text-slate-600 mt-0.5">
              {isEditing 
                ? "Modificar información del ítem de orden" 
                : "Ingresar información del nuevo ítem de orden"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Order Info Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Selección de Orden
            </Text>
          </View>

          <SearchableSelect
            label="Orden"
            value={orderId}
            onSelect={(id) => {
              setOrderId(id);
              const selectedOrder = orders.find((o) => o.id === Number(id));
              if (selectedOrder) {
                setOrderInfo(`Orden #${selectedOrder.id} - $${selectedOrder.totalAmount}`);
              }
              setErrors({ ...errors, orderId: "" });
            }}
            options={orders.map((order) => ({
              id: order.id,
              label: `Orden #${order.id}`,
              subtitle: `Total: $${order.totalAmount} • ${order.paymentStatus}`,
            }))}
            placeholder={orderInfo || "Seleccionar orden"}
            error={errors.orderId}
            icon="cart-outline"
          />

          {/* Product Info Section */}
          <View className="mb-4 mt-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Selección de Producto
            </Text>
          </View>

          <SearchableSelect
            label="Producto"
            value={productId}
            onSelect={(id) => {
              setProductId(id);
              const selectedProduct = products.find((p) => p.id === Number(id));
              if (selectedProduct) {
                setProductName(selectedProduct.name);
                // Auto-fill price with product's price
                setPrice(selectedProduct.price.toString());
              }
              setErrors({ ...errors, productId: "" });
            }}
            options={products.map((product) => ({
              id: product.id,
              label: product.name,
              subtitle: `$${product.price} • Stock: ${product.stock}`,
            }))}
            placeholder={productName || "Seleccionar producto"}
            error={errors.productId}
            icon="cube-outline"
          />

          {/* Quantity and Pricing */}
          <View className="mb-4 mt-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Cantidad y Precios
            </Text>
          </View>

          <Input
            label="Cantidad"
            placeholder="ej., 2"
            value={quantity}
            onChangeText={(text) => {
              setQuantity(text);
              setErrors({ ...errors, quantity: "" });
            }}
            error={errors.quantity}
            keyboardType="number-pad"
          />

          <Input
            label="Precio (por unidad)"
            placeholder="ej., 999.99"
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              setErrors({ ...errors, price: "" });
            }}
            error={errors.price}
            keyboardType="decimal-pad"
          />

          <Input
            label="Subtotal (auto-calculado)"
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
