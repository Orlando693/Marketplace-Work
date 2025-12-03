package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.repositories.ProductRepository;
import com.troyecto.marketplace.repositories.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // ✅ Permitir acceso desde el frontend
public class DashboardController {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Totales globales
            long totalProducts = productRepository.count();
            long totalStores   = storeRepository.count();

            // Productos por tienda
            List<Object[]> rawStats = productRepository.countProductsByStore();
            List<Map<String, Object>> productsPerStore = new ArrayList<>();

            for (Object[] row : rawStats) {
                // row[0] = nombre de la tienda
                // row[1] = cantidad de productos
                productsPerStore.add(Map.of(
                        "storeName", row[0],
                        "productCount", ((Number) row[1]).intValue()
                ));
            }

            // Armar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("totalProducts", totalProducts);
            response.put("totalStores", totalStores);
            response.put("productsPerStore", productsPerStore);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Error loading dashboard stats: " + e.getMessage()
                    ));
        }
    }
}
