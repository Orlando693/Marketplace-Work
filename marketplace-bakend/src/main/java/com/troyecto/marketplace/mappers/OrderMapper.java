package com.troyecto.marketplace.mappers;

import com.troyecto.marketplace.dtos.order.OrderRequest;
import com.troyecto.marketplace.dtos.order.OrderResponse;
import com.troyecto.marketplace.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    default Order mapOrderRequestToOrder(OrderRequest orderRequest) {
        if (orderRequest == null) return null;
        Order order = new Order();
        order.setSubtotal(orderRequest.getSubtotal());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setTax(orderRequest.getTax());
        order.setCurrency(orderRequest.getCurrency());
        order.setPayMethod(orderRequest.getPayMethod());
        order.setPaymentStatus(orderRequest.getPaymentStatus());
        return order;
    }

    default OrderResponse mapOrderToOrderResponse(Order order) {
        if (order == null) return null;
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setId(order.getId());
        orderResponse.setSubtotal(order.getSubtotal());
        orderResponse.setTotalAmount(order.getTotalAmount());
        orderResponse.setTax(order.getTax());
        orderResponse.setCurrency(order.getCurrency());
        orderResponse.setPayMethod(order.getPayMethod());
        orderResponse.setPaymentStatus(order.getPaymentStatus());
        orderResponse.setOrderDate(order.getOrderDate());
        if (order.getUser() != null) {
            orderResponse.setUserId(order.getUser().getId());
            orderResponse.setUserName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        }
        if(order.getOrderItems() != null) {
            orderResponse.setOrderItemsId(
                    order.getOrderItems().stream().
                            map(OrderItem->OrderItem.getId()).
                            collect(Collectors.toList())
            );
        } else {
            orderResponse.setOrderItemsId(new ArrayList<>());
        }

        return orderResponse;
    }

    default void updateOrderFromRequest(OrderRequest orderRequest, Order order) {
        if (orderRequest == null || order == null) {
            return;
        }
        if (orderRequest.getSubtotal() != null) {
            order.setSubtotal(orderRequest.getSubtotal());
        }
        if (orderRequest.getTotalAmount() != null) {
            order.setTotalAmount(orderRequest.getTotalAmount());
        }
        if (orderRequest.getTax() != null) {
            order.setTax(orderRequest.getTax());
        }
        if (orderRequest.getCurrency() != null) {
            order.setCurrency(orderRequest.getCurrency());
        }
        if (orderRequest.getPayMethod() != null) {
            order.setPayMethod(orderRequest.getPayMethod());
        }
        if (orderRequest.getPaymentStatus() != null) {
            order.setPaymentStatus(orderRequest.getPaymentStatus());
        }
    }
}
