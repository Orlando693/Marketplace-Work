package com.troyecto.marketplace.dtos.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    @NotNull
    private Double subtotal;

    @NotNull
    private Integer totalAmount;

    @NotNull
    private Double tax;

    @NotBlank
    private String currency;

    @NotBlank
    private String payMethod;

    @NotBlank
    private String paymentStatus;

    private LocalDateTime orderDate;

    @NotNull (message = "User Id cannot be null")
    private Long userId;

    private String userName;
}
