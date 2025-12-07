// src/screens/ReviewFormScreen.tsx
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
import { Input, Button, Loading } from "../components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewFormScreen() {
  const params = useLocalSearchParams();
  const reviewId = params.id ? Number(params.id) : null;
  const isEditing = !!reviewId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");

  const [errors, setErrors] = useState({
    rating: "",
    comment: "",
    userId: "",
    productId: "",
  });

  useEffect(() => {
    if (isEditing) {
      fetchReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId]);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const res = await getReview(reviewId!);
      const review = res.data;
      setRating(review.rating);
      setComment(review.comment);
      setUserId(review.userId.toString());
      setProductId(review.productId.toString());
    } catch {
      Alert.alert("Error", "Could not load review");
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
      newErrors.rating = "Please select a rating";
    }
    if (!comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (comment.trim().length > 250) {
      newErrors.comment = "Comment cannot exceed 250 characters";
    }
    if (!userId.trim() || isNaN(Number(userId)) || Number(userId) <= 0) {
      newErrors.userId = "User ID is required";
    }
    if (!productId.trim() || isNaN(Number(productId)) || Number(productId) <= 0) {
      newErrors.productId = "Product ID is required";
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
        userId: parseInt(userId, 10),
        productId: parseInt(productId, 10),
      };

      if (isEditing) {
        await updateReview(reviewId!, payload);
        Alert.alert("Success", "Review updated successfully");
      } else {
        await addReview(payload);
        Alert.alert("Success", "Review created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Could not save review. Please verify the data."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = () => {
    return (
      <View>
        <Text className="text-slate-700 font-semibold mb-2">Rating *</Text>
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
            Selected: {rating} {rating === 1 ? "star" : "stars"}
          </Text>
        )}
        {errors.rating && (
          <Text className="text-danger-600 text-sm mt-1">{errors.rating}</Text>
        )}
      </View>
    );
  };

  if (loading) return <Loading text="Loading review..." />;

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
            {isEditing ? "Edit Review" : "New Review"}
          </Text>
          <Text className="text-slate-600 mt-1">
            {isEditing 
              ? "Modify review information" 
              : "Enter new review information"}
          </Text>
        </View>

        {/* Card contenedor */}
        <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Rating Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-4">
              ⭐ Rating
            </Text>
            {renderStarSelector()}
          </View>

          {/* Comment Section */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              💬 Comment
            </Text>
            <Input
              label="Your Review"
              placeholder="Share your experience with this product..."
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
              {comment.length}/250 characters
            </Text>
          </View>

          {/* IDs Section */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-slate-700 mb-2">
              🔗 References
            </Text>
          </View>

          <Input
            label="User ID"
            placeholder="e.g., 1"
            value={userId}
            onChangeText={(text) => {
              setUserId(text);
              setErrors({ ...errors, userId: "" });
            }}
            error={errors.userId}
            keyboardType="number-pad"
          />

          <Input
            label="Product ID"
            placeholder="e.g., 5"
            value={productId}
            onChangeText={(text) => {
              setProductId(text);
              setErrors({ ...errors, productId: "" });
            }}
            error={errors.productId}
            keyboardType="number-pad"
          />

          {/* Preview */}
          {rating > 0 && comment.trim() && (
            <View className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <Text className="text-blue-900 font-semibold mb-2">Preview:</Text>
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
                "{comment}"
              </Text>
            </View>
          )}

          <View className="flex-row gap-3 mt-6 mb-6">
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
