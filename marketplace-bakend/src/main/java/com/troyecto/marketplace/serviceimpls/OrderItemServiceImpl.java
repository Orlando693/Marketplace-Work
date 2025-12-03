package com.troyecto.marketplace.serviceimpls;


import com.troyecto.marketplace.dtos.orderItem.OrderItemRequest;
import com.troyecto.marketplace.dtos.orderItem.OrderItemResponse;
import com.troyecto.marketplace.entities.Order;
import com.troyecto.marketplace.entities.OrderItem;
import com.troyecto.marketplace.entities.Product;
import com.troyecto.marketplace.exceptions.ResourceNotFoundException;
import com.troyecto.marketplace.mappers.OrderItemMapper;
import com.troyecto.marketplace.repositories.OrderItemRepository;
import com.troyecto.marketplace.repositories.OrderRepository;
import com.troyecto.marketplace.repositories.ProductRepository;
import com.troyecto.marketplace.services.OrderItemService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {


    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderItemMapper orderItemMapper;

    @Override
    public OrderItemResponse createOrderItem(OrderItemRequest orderItemRequest) {
        OrderItem orderItem = orderItemMapper.mapOrderItemRequestToOrderItem(orderItemRequest);
        Order order = orderRepository.findById(orderItemRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order"));
        orderItem.setOrder(order);
        Product product = productRepository.findById(orderItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product"));
        orderItem.setProduct(product);
        OrderItem savedItem = orderItemRepository.save(orderItem);
        updateOrderTotals(savedItem.getOrder().getId());
        return orderItemMapper.mapOrderItemToOrderItemResponse(orderItemRepository.save(orderItem));
    }

    @Override
    public OrderItemResponse updateOrderItem(Long id, OrderItemRequest orderItemRequest) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem not found"));
        Order order = orderRepository.findById(orderItemRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order"));
        Product product = productRepository.findById(orderItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product"));
        orderItemMapper.updateOrderItemFromRequest(orderItemRequest,orderItem);
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        updateOrderTotals(orderItem.getOrder().getId());
        return orderItemMapper.mapOrderItemToOrderItemResponse(orderItemRepository.save(orderItem));
    }

    @Override
    public OrderItemResponse getOrderItemById(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Item de la Orden no encontrado con id" + id));
        return orderItemMapper.mapOrderItemToOrderItemResponse(orderItem);
    }

    @Override
    public String deleteOrderItem(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("No se pudo eliminar Item de la Orden.Item de la Orden no encontrado con id" + id));
        Order order = orderItem.getOrder();
        orderItemRepository.delete(orderItem);
        order.recalculateTotals();
        orderRepository.save(order);
        return "Item de la orden con ID " + id + "eliminado exitosamente";
    }

    @Override
    public List<OrderItemResponse> getOrderItems() {
        return orderItemRepository.findAll()
                .stream()
                .map(orderItemMapper::mapOrderItemToOrderItemResponse)
                .collect(Collectors.toList());
    }

    private void updateOrderTotals(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        double subtotal = order.getOrderItems().stream().mapToDouble(OrderItem::getSubtotal).sum();
        int totalAmount = order.getOrderItems().stream().mapToInt(OrderItem::getQuantity).sum();
        order.setSubtotal(subtotal + subtotal * 0.05);
        order.setTotalAmount(totalAmount);
        order.setTax(subtotal * 0.05);
        orderRepository.save(order);
    }
}
