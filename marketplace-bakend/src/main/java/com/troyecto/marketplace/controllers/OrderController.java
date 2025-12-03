package com.troyecto.marketplace.controllers;

import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.order.OrderRequest;
import com.troyecto.marketplace.dtos.order.OrderResponse;
import com.troyecto.marketplace.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le dice a Spring que esta clase es un controlador que manejará peticiones REST.
@RequestMapping("/api/orders")
@CrossOrigin("*")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    // - @RequiredArgsConstructor genera un constructor con argumentos para las dependencias finales (inyección de OrderService).
    // - Usar ResponseEntity permite controlar el cuerpo y el status HTTP devuelto.

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> addOrder(@Valid @RequestBody OrderRequest orderRequest) {
        OrderResponse savedOrder = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(ApiResponse.ok("Orden creada exitosamente", savedOrder));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> savedOrders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok("Ordenes encontradas exitosamente", savedOrders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse orderResponse = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Orden encontrada exitosamente", orderResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderRequest orderRequest) {
        OrderResponse savedOrder = orderService.updateOrder(id, orderRequest);
        return ResponseEntity.ok(ApiResponse.ok("Orden encontrada exitosamente", savedOrder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        String message = orderService.deleteOrder(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
