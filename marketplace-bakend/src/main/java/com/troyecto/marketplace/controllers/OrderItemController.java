package com.troyecto.marketplace.controllers;


import com.troyecto.marketplace.common.ApiResponse;
import com.troyecto.marketplace.dtos.orderItem.OrderItemRequest;
import com.troyecto.marketplace.dtos.orderItem.OrderItemResponse;
import com.troyecto.marketplace.services.OrderItemService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderItems")
@CrossOrigin("*")
@AllArgsConstructor // Para inyectar el servicio.
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderItemResponse>> createOrderItem(@Valid @RequestBody OrderItemRequest orderItemRequest) {
        OrderItemResponse savedOrderItem = orderItemService.createOrderItem(orderItemRequest);
        return ResponseEntity.ok(ApiResponse.ok("OrderItem creado", savedOrderItem));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderItemResponse>>> getAllOrderItems() {
        List<OrderItemResponse> orderItems = orderItemService.getOrderItems();
        return ResponseEntity.ok(ApiResponse.ok("OrderItems encontrados", orderItems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderItemResponse>> getOrderItemById(@PathVariable Long id) {
        OrderItemResponse savedOrderItem = orderItemService.getOrderItemById(id);
        return ResponseEntity.ok(ApiResponse.ok("OrderItem encontrado", savedOrderItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderItemResponse>> updateOrderItem (@PathVariable Long id, @Valid @RequestBody OrderItemRequest orderItemRequest) {
        OrderItemResponse savedOrderItem = orderItemService.updateOrderItem(id, orderItemRequest);
        return ResponseEntity.ok(ApiResponse.ok("OrderItem encontrado", savedOrderItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrderItem(@PathVariable Long id) {
        String message = orderItemService.deleteOrderItem(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
