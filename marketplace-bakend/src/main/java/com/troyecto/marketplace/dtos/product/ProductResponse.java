package com.troyecto.marketplace.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private LocalDateTime publishedDate;
    private Boolean isAvailable;

    // Relación con Store representada por campos simples
    private Long storeId;
    private String storeName;

    // Solo exponemos IDs de relaciones para no enviar objetos completos
    private List<Long> orderItemsId;
    private List<Long> reviewsId;
}
