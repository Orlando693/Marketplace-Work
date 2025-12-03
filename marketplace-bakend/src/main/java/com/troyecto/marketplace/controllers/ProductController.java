package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.product.ProductRequest;
import com.troyecto.marketplace.dtos.product.ProductResponse;
import com.troyecto.marketplace.services.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
@AllArgsConstructor // Genera constructor para inyectar dependencias finales (ProductService)
public class ProductController {
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse savedProduct= productService.createProduct(productRequest);
        return  ResponseEntity.ok(ApiResponse.ok("Producto creado exitosamente", savedProduct));
        // Devuelve 201 Created cuando la creación es exitosa.
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>>getAllProducts(){
        List<ProductResponse> products= productService.getAllProducts();
        return  ResponseEntity.ok(ApiResponse.ok("Productos creado exitosamente", products));
        //  ResponseEntity.ok(products) es equivalente y más conciso.
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductsById(@PathVariable Long id){
        ProductResponse productResponse=productService.getProductById(id);
        return  ResponseEntity.ok(ApiResponse.ok("Producto encontrado exitosamente", productResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @Valid@RequestBody ProductRequest productRequest){
        ProductResponse savedProduct=productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(ApiResponse.ok("Producto actualizado exitosamente", savedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
        String message=productService.cancelProduct(id);
        return new ResponseEntity<>(message,HttpStatus.OK);
    }
}
