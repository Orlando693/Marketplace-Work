package com.troyecto.marketplace.mappers;

import com.troyecto.marketplace.dtos.orderItem.OrderItemRequest;
import com.troyecto.marketplace.dtos.orderItem.OrderItemResponse;
import com.troyecto.marketplace.entities.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper( componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderItemMapper {

    default OrderItem mapOrderItemRequestToOrderItem(OrderItemRequest orderItemRequest) {
        if (orderItemRequest == null) return null;
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(orderItemRequest.getQuantity());
        orderItem.setPrice(orderItemRequest.getPrice());
        orderItem.setSubtotal(orderItemRequest.getSubtotal());

        return orderItem;
    }

    default OrderItemResponse mapOrderItemToOrderItemResponse(OrderItem orderItem) {
        if (orderItem == null) return null;
        OrderItemResponse orderItemResponse = new OrderItemResponse();
        orderItemResponse.setId(orderItem.getId());
        orderItemResponse.setQuantity(orderItem.getQuantity());
        orderItemResponse.setPrice(orderItem.getPrice());
        orderItemResponse.setSubtotal(orderItem.getSubtotal());
        if(orderItem.getOrder() != null) {
            orderItemResponse.setOrderId(orderItem.getOrder().getId());
        }
        if(orderItem.getProduct() != null) {
            orderItemResponse.setProductId(orderItem.getProduct().getId());
            orderItemResponse.setProductName(orderItem.getProduct().getName());
        }
        return orderItemResponse;
    }

    default void updateOrderItemFromRequest(OrderItemRequest orderItemRequest, OrderItem orderItem) {
        if (orderItemRequest == null || orderItem == null) return;

        if (orderItemRequest.getQuantity() != null){
            orderItem.setQuantity(orderItemRequest.getQuantity());
        }
        if (orderItemRequest.getPrice() != null){
            orderItem.setPrice(orderItemRequest.getPrice());
        }
        if (orderItemRequest.getSubtotal() != null){
            orderItem.setSubtotal(orderItemRequest.getSubtotal());
        }
    }
}
