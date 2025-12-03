package com.troyecto.marketplace.dtos.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {
    @NotNull(message = "Rating is required")
    private Integer rating;
    @NotBlank(message = "Comment cannot be blank")
    @Size(max = 250, message = "Comment cannot surpass 250 characters")
    private String comment;
    @NotNull(message = "Product ID is required")
    private Long productId;
    @NotNull(message = "User ID is required")
    private Long userId;

}
