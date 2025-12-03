package com.troyecto.marketplace.serviceimpls;

import com.troyecto.marketplace.dtos.review.ReviewRequest;
import com.troyecto.marketplace.dtos.review.ReviewResponse;
import com.troyecto.marketplace.entities.Product;
import com.troyecto.marketplace.entities.Review;
import com.troyecto.marketplace.entities.User;
import com.troyecto.marketplace.exceptions.ResourceNotFoundException;
import com.troyecto.marketplace.mappers.ReviewMapper;
import com.troyecto.marketplace.repositories.ProductRepository;
import com.troyecto.marketplace.repositories.ReviewRepository;
import com.troyecto.marketplace.repositories.UserRepository;
import com.troyecto.marketplace.services.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReviewServiceImpls implements ReviewService {
    @Autowired//Inyeccion de dependencias automatica
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    @Override
    public ReviewResponse createReview(ReviewRequest reviewRequest) {
        User user= userRepository.findById(reviewRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id"+reviewRequest.getUserId()));
        Product product= productRepository.findById(reviewRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id"+reviewRequest.getProductId()));
        Review review=reviewMapper.toEntity(reviewRequest);
        review.setUser(user);
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview= reviewRepository.save(review);
        return reviewMapper.toResponse(savedReview);
    }

    @Override
    public ReviewResponse updateReview(Long id, ReviewRequest reviewdetails) {
        Review review=reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id"+id));
        User user= userRepository.findById(reviewdetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id"+reviewdetails.getUserId()));
        Product product= productRepository.findById(reviewdetails.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id"+reviewdetails.getProductId()));
        reviewMapper.updateReviewFromRequest(reviewdetails, review);
        review.setUpdatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setProduct(product);
        Review updatedReview= reviewRepository.save(review);
        return reviewMapper.toResponse(updatedReview);
    }

    @Override
    public String deleteReview(Long id) {
        Review review=reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id"+id));
        reviewRepository.delete(review);
        return "Review deleted successfully";
    }

    @Override
    public ReviewResponse getReviewById(Long id) {
        Review review=reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id"+id));
        return reviewMapper.toResponse(review);
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(reviewMapper::toResponse)
                .collect(Collectors.toList());
    }
}
