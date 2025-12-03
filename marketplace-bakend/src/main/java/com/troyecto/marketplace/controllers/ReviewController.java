package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.review.ReviewRequest;
import com.troyecto.marketplace.dtos.review.ReviewResponse;
import com.troyecto.marketplace.services.ReviewService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le dice a Spring que esta clase es un controlador que manejará peticiones REST.
@RequestMapping("/api/reviews") // Define la URL base para todos los endpoints en esta clase.
@CrossOrigin("*")
@AllArgsConstructor // Para inyectar el servicio
public class ReviewController {
    private ReviewService reviewService;
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest reviewRequest) {
        ReviewResponse savedReview = reviewService.createReview(reviewRequest);
        return ResponseEntity.ok(ApiResponse.ok("Review creada existosamente",savedReview));// Devuelve el usuario creado y un código 201.
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(ApiResponse.ok("Reviews creada existosamente",reviews));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.ok("producto encontrado exitosamente",review)); // Devuelve el usuario y un código 200.
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(@PathVariable Long id, @Valid@RequestBody ReviewRequest reviewRequest) {
        ReviewResponse updatedReview = reviewService.updateReview(id, reviewRequest);
        return ResponseEntity.ok(ApiResponse.ok("Review actualizada existosamente",updatedReview));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully.");
    }
}
