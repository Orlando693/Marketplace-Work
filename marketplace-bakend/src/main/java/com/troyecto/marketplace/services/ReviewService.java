package com.troyecto.marketplace.services;
import com.troyecto.marketplace.dtos.review.ReviewRequest;
import com.troyecto.marketplace.dtos.review.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest reviewRequest);
    ReviewResponse updateReview(Long id, ReviewRequest reviewdetails);
    String deleteReview(Long id);
    ReviewResponse getReviewById(Long id);
    List<ReviewResponse> getAllReviews();
}

