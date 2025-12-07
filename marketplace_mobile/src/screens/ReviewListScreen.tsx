// src/screens/ReviewListScreen.tsx
import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { getAllReviews, deleteReview, Review } from "../services/reviewService";
import { getAllUsers } from "../services/userService";
import { getAllProducts } from "../services/productService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function ReviewListScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReviews = async () => {
    try {
      console.log("🔄 Loading reviews, users, and products...");
      const [reviewsRes, usersRes, productsRes] = await Promise.all([
        getAllReviews(),
        getAllUsers(),
        getAllProducts(),
      ]);
      
      console.log("📦 Reviews response:", reviewsRes.data);
      console.log("👥 Users response:", usersRes.data);
      console.log("🛍️ Products response:", productsRes.data);
      
      // El backend devuelve ApiResponse<List<ReviewResponse>>
      const reviewsArray = (reviewsRes.data as any)?.data || reviewsRes.data;
      const usersArray = (usersRes.data as any)?.data || usersRes.data;
      const productsArray = (productsRes.data as any)?.data || productsRes.data;
      
      console.log("✅ Parsed arrays:", {
        reviews: reviewsArray?.length || 0,
        users: usersArray?.length || 0,
        products: productsArray?.length || 0
      });
      
      // Enriquecer las reviews con los nombres de usuario y producto
      const enrichedReviews = (Array.isArray(reviewsArray) ? reviewsArray : []).map((review: Review) => {
        const user = usersArray.find((u: any) => u.id === review.userId);
        const product = productsArray.find((p: any) => p.id === review.productId);
        
        return {
          ...review,
          userName: user ? `${user.firstName} ${user.lastName}` : undefined,
          productName: product ? product.name : undefined,
        };
      });
      
      console.log("✨ Enriched reviews:", enrichedReviews);
      setReviews(enrichedReviews);
    } catch (error) {
      console.error("❌ Error loading reviews:", error);
      Alert.alert("Error", "Could not load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to permanently delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(id);
              Alert.alert("Success", "Review deleted successfully");
              loadReviews();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete review");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? "#eab308" : "#cbd5e1"}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Loading text="Loading reviews..." />;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Modern Header with back button */}
      <View className="bg-white px-6 pt-12 pb-4 border-b border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => router.push("/home")}
              className="mr-4 p-2 rounded-full bg-slate-100 active:bg-slate-200"
            >
              <Ionicons name="arrow-back" size={20} color="#1e293b" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-slate-800">Reviews</Text>
              <Text className="text-slate-600 mt-0.5">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"} registered
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/review-form")}
            className="bg-blue-600 px-4 py-2.5 rounded-xl flex-row items-center active:bg-blue-700 shadow-md"
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-1.5">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Card List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon="⭐"
            title="No reviews"
            description="No reviews registered. Create one to get started."
            actionLabel="Add Review"
            onAction={() => router.push("/review-form")}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-slate-100">
            {/* Header with icon and ID */}
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-xl bg-yellow-100 items-center justify-center mr-3">
                <Ionicons name="star" size={24} color="#eab308" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-500 uppercase tracking-wide">Review #{item.id}</Text>
                <View className="flex-row items-center mt-1">
                  {renderStars(item.rating)}
                  <Text className="text-sm font-bold text-slate-800 ml-2">
                    {item.rating}/5
                  </Text>
                </View>
              </View>
              <View className="bg-slate-100 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-semibold text-slate-700">
                  {formatDate(item.createdDate)}
                </Text>
              </View>
            </View>

            {/* Comment */}
            <View className="bg-slate-50 rounded-xl p-4 mb-4">
              <Text className="text-slate-700 leading-5 italic">&ldquo;{item.comment}&rdquo;</Text>
            </View>

            {/* Info Grid */}
            <View className="bg-slate-50 rounded-xl p-4 mb-4">
              <View className="flex-row mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="person-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">User</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{item.userName || `User #${item.userId}`}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="cube-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Product</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{item.productName || `Product #${item.productId}`}</Text>
                </View>
              </View>
              <View className="flex-row">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                    <Text className="text-xs text-slate-500 ml-1.5">Updated</Text>
                  </View>
                  <Text className="text-base font-bold text-slate-800">{formatDate(item.updatedDate)}</Text>
                </View>
                <View className="flex-1" />
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => router.push(`/review-form?id=${item.id}`)}
                className="flex-1 bg-yellow-500 py-3 rounded-xl flex-row items-center justify-center active:bg-yellow-600"
              >
                <Ionicons name="create-outline" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item.id)}
                className="flex-1 bg-red-500 py-3 rounded-xl flex-row items-center justify-center active:bg-red-600"
              >
                <Ionicons name="trash-outline" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
