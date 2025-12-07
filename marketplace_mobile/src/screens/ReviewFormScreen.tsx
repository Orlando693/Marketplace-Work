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
import { addReview, getReview, updateReview } from "../services/reviewService";
import { getAllUsers, User } from "../services/userService";
import { getAllProducts, Product } from "../services/productService";
import { Input, Button, Loading, SearchableSelect } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewFormScreen() {
  const params = useLocalSearchParams();
  const reviewId = params.id ? Number(params.id) : null;
  const isEditing = !!reviewId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState<number | string>("");
  const [productId, setProductId] = useState<number | string>("");
  const [userName, setUserName] = useState("");
  const [productName, setProductName] = useState("");

  const [errors, setErrors] = useState({
    rating: "",
    comment: "",
    userId: "",
    productId: "",
  });

  useEffect(() => {
    loadUsers();
    loadProducts();
    if (isEditing) {
      fetchReview();
    }
  }, [reviewId]);

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

  const fetchReview = async () => {
    setLoading(true);
    try {
      const res = await getReview(reviewId!);
      const review = (res.data as any)?.data || res.data;
      setRating(review.rating);
      setComment(review.comment);
      setUserId(review.userId.toString());
      setProductId(review.productId.toString());
      
      const selectedUser = users.find((u) => u.id === review.userId);
      if (selectedUser) {
        setUserName(`${selectedUser.firstName} ${selectedUser.lastName}`);
      }
      
      const selectedProduct = products.find((p) => p.id === review.productId);
      if (selectedProduct) {
        setProductName(selectedProduct.name);
      }
    } catch {
      Alert.alert("Error", "No se pudo cargar la reseña");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      rating: "",
      comment: "",
      userId: "",
      productId: "",
    };

    if (rating === 0) {
      newErrors.rating = "Por favor selecciona una calificación";
    }
    if (!comment.trim()) {
      newErrors.comment = "El comentario es requerido";
    } else if (comment.trim().length > 250) {
      newErrors.comment = "El comentario no puede exceder 250 caracteres";
    }
    if (!userId.toString().trim() || isNaN(Number(userId)) || Number(userId) <= 0) {
      newErrors.userId = "El usuario es requerido";
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
        rating: rating,
        comment: comment.trim(),
        userId: parseInt(userId.toString(), 10),
        productId: parseInt(productId.toString(), 10),
      };

      if (isEditing) {
        await updateReview(reviewId!, payload);
        Alert.alert("Éxito", "Reseña actualizada exitosamente");
      } else {
        await addReview(payload);
        Alert.alert("Éxito", "Reseña creada exitosamente");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "No se pudo guardar la reseña. Por favor verifica los datos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = () => {
    return (
      <View>
        <Text className="text-slate-700 font-semibold mb-2">Calificación *</Text>
        <View className="flex-row gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => {
                setRating(star);
                setErrors({ ...errors, rating: "" });
              }}
              className="p-2"
            >
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={40}
                color={star <= rating ? "#eab308" : "#cbd5e1"}
              />
            </Pressable>
          ))}
        </View>
        {rating > 0 && (
          <Text className="text-slate-600 text-sm mb-2">
            Seleccionado: {rating} {rating === 1 ? "estrella" : "estrellas"}
          </Text>
        )}
        {errors.rating && (
          <Text className="text-danger-600 text-sm mt-1">{errors.rating}</Text>
        )}
      </View>
    );
  };

  if (loading) return <Loading text="Cargando reseña..." />;

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
            {isEditing ? "Editar Reseña" : "Nueva Reseña"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modificar información de la reseña" 
              : "Ingresar información de la nueva reseña"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Rating Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-4">
              Calificación
            </Text>
            {renderStarSelector()}
          </View>

          {/* Comment Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Comentario
            </Text>
            <Input
              label="Tu Reseña"
              placeholder="Comparte tu experiencia con este producto..."
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                setErrors({ ...errors, comment: "" });
              }}
              error={errors.comment}
              multiline
              numberOfLines={6}
              style={{ height: 120, textAlignVertical: "top" }}
            />
            <Text className="text-slate-500 text-xs mt-1 text-right">
              {comment.length}/250 caracteres
            </Text>
          </View>

          {/* User Selection */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Información del Usuario
            </Text>
          </View>

          <SearchableSelect
            label="Usuario"
            value={userId}
            onSelect={(id) => {
              setUserId(id);
              const selectedUser = users.find((u) => u.id === Number(id));
              if (selectedUser) {
                setUserName(`${selectedUser.firstName} ${selectedUser.lastName}`);
              }
              setErrors({ ...errors, userId: "" });
            }}
            options={users.map((user) => ({
              id: user.id,
              label: `${user.firstName} ${user.lastName}`,
              subtitle: `${user.email} • ${user.phone}`,
            }))}
            placeholder={userName || "Seleccionar usuario"}
            error={errors.userId}
            icon="person-outline"
          />

          {/* Product Selection */}
          <View className="mb-4 mt-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              Información del Producto
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
              }
              setErrors({ ...errors, productId: "" });
            }}
            options={products.map((product) => ({
              id: product.id,
              label: product.name,
              subtitle: `$${product.price} • ${product.storeName || "Tienda Desconocida"}`,
            }))}
            placeholder={productName || "Seleccionar producto"}
            error={errors.productId}
            icon="cube-outline"
          />

          {/* Preview */}
          {rating > 0 && comment.trim() && (
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <Text className="text-blue-900 font-semibold mb-2">Vista Previa:</Text>
              <View className="flex-row mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= rating ? "star" : "star-outline"}
                    size={16}
                    color={star <= rating ? "#eab308" : "#cbd5e1"}
                  />
                ))}
              </View>
              <Text className="text-blue-800 text-sm" numberOfLines={3}>
                &quot;{comment}&quot;
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
