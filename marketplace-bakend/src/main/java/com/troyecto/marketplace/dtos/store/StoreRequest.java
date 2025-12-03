package com.troyecto.marketplace.dtos.store;

import com.troyecto.marketplace.entities.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreRequest {
    @NotBlank(message = "Store name is required")
    private String name;
    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Category is required")
    private String category;
    @NotNull(message = "isActive status is required")
    private Boolean isActive;
    @NotNull(message = "User ID is required")
    private Long userId;

}
