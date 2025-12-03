package com.troyecto.marketplace.services;

import com.troyecto.marketplace.dtos.order.OrderRequest;
import com.troyecto.marketplace.dtos.order.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest orderRequest);
    OrderResponse updateOrder(Long id, OrderRequest orderRequest);
    String deleteOrder(Long id);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getAllOrders();
}
