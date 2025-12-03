package com.troyecto.marketplace.services;

import com.troyecto.marketplace.dtos.product.ProductRequest;
import com.troyecto.marketplace.dtos.product.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest productRequest);
    ProductResponse updateProduct(Long id, ProductRequest productRequest);
    String cancelProduct(Long id);
    ProductResponse getProductById(Long id); // Recupera y mapea a DTO.
    List<ProductResponse> getAllProducts(); // Lista todos los productos mapeados a DTO.
}
