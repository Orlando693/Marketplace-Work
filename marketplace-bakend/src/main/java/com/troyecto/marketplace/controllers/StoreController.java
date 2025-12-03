package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.store.StoreRequest;
import com.troyecto.marketplace.dtos.store.StoreResponse;
import com.troyecto.marketplace.services.StoreService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin("*")
@AllArgsConstructor
public class StoreController {

    private final  StoreService storeService;


    /**
     * Endpoint para registrar una nueva tienda, usando DTOs para la comunicación.
     * Método: POST /api/stores
     */
    @PostMapping
    // 2. Recibimos el DTO en lugar de la Entity
    public ResponseEntity<ApiResponse<StoreResponse>> registerStore(@Valid @RequestBody StoreRequest storeRequest) {
        StoreResponse savedStoreResponse = storeService.RegisterNewStore(storeRequest);
        return ResponseEntity.ok(ApiResponse.ok("Store registered successfully", savedStoreResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStore(@PathVariable Long id, @Valid@RequestBody StoreRequest storeRequest) {
        StoreResponse updatedStore = storeService.UpdateStore(id, storeRequest);
        return  ResponseEntity.ok(ApiResponse.ok("Store updated successfully", updatedStore));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getAllStores() {
        List<StoreResponse> stores = storeService.getStores();
        return ResponseEntity.ok(ApiResponse.ok("Stores retrieved successfully", stores));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreResponse>> deleteStore(@PathVariable Long id) {
        storeService.DeleteStore(id);
        return ResponseEntity.ok(ApiResponse.ok("Store deleted successfully", null));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StoreResponse>> getStoreById(@PathVariable Long id) {
        StoreResponse store = storeService.getStoreById(id);
        return  ResponseEntity.ok(ApiResponse.ok("All stores are getted succesfully",store)); // Devuelve el usuario y un código 200.
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()  // HTTP 400
                .body(ex.getMessage()); // Devuelve el mensaje exacto del error
    }
    }