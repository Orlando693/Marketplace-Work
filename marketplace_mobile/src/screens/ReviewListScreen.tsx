// src/screens/ReviewListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable, Alert, RefreshControl, ScrollView } from "react-native";
import { router } from "expo-router";
import { getAllReviews, deleteReview, Review } from "../services/reviewService";
import { Loading, EmptyState } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewListScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await getAllReviews();
      console.log("API Response:", res);
      console.log("Reviews data:", res.data);
      
      // El backend devuelve ApiResponse<List<ReviewResponse>>
      const reviewsArray = (res.data as any)?.data || res.data;
      console.log("Reviews array:", reviewsArray);
      
      setReviews(Array.isArray(reviewsArray) ? reviewsArray : []);
    } catch (error) {
      console.error("Error loading reviews:", error);
      Alert.alert("Error", "Could not load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No reviews"
        description="No reviews registered. Create one to get started."
        actionLabel="Add Review"
        onAction={() => router.push("/review-form")}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-slate-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-slate-800">Reviews</Text>
            <Text className="text-slate-600 mt-1">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"} registered
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/review-form")}
            className="bg-blue-400 px-4 py-2 rounded-lg active:bg-blue-500"
          >
            <Text className="text-white font-semibold">Add Review</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabla */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 900 }}>
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View className="bg-slate-800 flex-row px-4 py-3">
                <Text className="text-white font-bold text-xs w-12">ID</Text>
                <Text className="text-white font-bold text-xs w-24">Rating</Text>
                <Text className="text-white font-bold text-xs flex-1">Comment</Text>
                <Text className="text-white font-bold text-xs w-24">User ID</Text>
                <Text className="text-white font-bold text-xs w-28">Product ID</Text>
                <Text className="text-white font-bold text-xs w-24">Created</Text>
                <Text className="text-white font-bold text-xs w-24">Updated</Text>
                <Text className="text-white font-bold text-xs w-32 text-center">Actions</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View className="bg-white flex-row px-4 py-3 border-b border-slate-200 items-center">
                {/* ID */}
                <Text className="text-slate-600 text-xs w-12">{item.id}</Text>
                
                {/* Rating */}
                <View className="w-24">
                  <View className="flex-row items-center gap-1">
                    {renderStars(item.rating)}
                  </View>
                  <Text className="text-warning-600 font-bold text-xs mt-1">
                    {item.rating}/5
                  </Text>
                </View>
                
                {/* Comment */}
                <Text className="text-slate-700 text-sm flex-1 pr-2" numberOfLines={2}>
                  {item.comment}
                </Text>
                
                {/* User ID */}
                <View className="w-24">
                  <View className="bg-primary-100 px-2 py-1 rounded">
                    <Text className="text-primary-700 text-xs font-semibold text-center">
                      U-{item.userId}
                    </Text>
                  </View>
                </View>
                
                {/* Product ID */}
                <View className="w-28">
                  <View className="bg-warning-100 px-2 py-1 rounded">
                    <Text className="text-warning-700 text-xs font-semibold text-center">
                      P-{item.productId}
                    </Text>
                  </View>
                </View>
                
                {/* Created Date */}
                <Text className="text-slate-500 text-xs w-24">
                  {formatDate(item.createdDate)}
                </Text>
                
                {/* Updated Date */}
                <Text className="text-slate-500 text-xs w-24">
                  {formatDate(item.updatedDate)}
                </Text>
                
                {/* Actions */}
                <View className="flex-row gap-2 w-32 justify-center">
                  <Pressable
                    onPress={() => router.push(`/review-form?id=${item.id}`)}
                    className="bg-warning-500 px-3 py-1 rounded active:bg-warning-600"
                  >
                    <Text className="text-white text-xs font-semibold">Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item.id)}
                    className="bg-danger-500 px-3 py-1 rounded active:bg-danger-600"
                  >
                    <Text className="text-white text-xs font-semibold">Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
