// src/services/reviewService.ts
import { api } from "./api";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdDate: string;
  updatedDate: string;
  productId: number;
  userId: number;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
  productId: number;
  userId: number;
}

export const getAllReviews = () => api.get<Review[]>("/reviews");
export const getReview = (id: number) => api.get<Review>(`/reviews/${id}`);
export const addReview = (review: ReviewRequest) => api.post<Review>("/reviews", review);
export const updateReview = (id: number, review: ReviewRequest) => 
  api.put<Review>(`/reviews/${id}`, review);
export const deleteReview = (id: number) => api.delete(`/reviews/${id}`);
