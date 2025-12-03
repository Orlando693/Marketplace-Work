package com.troyecto.marketplace.services;

import com.troyecto.marketplace.dtos.orderItem.OrderItemRequest;
import com.troyecto.marketplace.dtos.orderItem.OrderItemResponse;

import java.util.List;

public interface OrderItemService {
    OrderItemResponse createOrderItem(OrderItemRequest orderItemRequest);
    OrderItemResponse updateOrderItem(Long id, OrderItemRequest orderItemRequest);
    String deleteOrderItem(Long id);
    List<OrderItemResponse> getOrderItems();
    OrderItemResponse getOrderItemById(Long id);
}
