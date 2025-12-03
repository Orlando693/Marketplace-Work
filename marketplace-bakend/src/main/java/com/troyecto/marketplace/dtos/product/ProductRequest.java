package com.troyecto.marketplace.dtos.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Name cannot be null")
    private String name;

    @NotBlank(message = "Description cannot be null")
    private String description;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Stock cannot be null")
    @Positive(message = "Stock must be greater than zero")
    private Integer stock;

    private LocalDateTime publishedDate;

    @NotNull(message = "Availability cannot be null")
    private Boolean isAvailable;

    // Lo importante para crear el Product es el storeId.
    @NotNull(message = "Store Id cannot be null")
    private Long storeId;

    // Este campo normalmente no es necesario en el request, pero si quieres permitir que te lo manden, lo dejas opcional
    private String storeName;
}
