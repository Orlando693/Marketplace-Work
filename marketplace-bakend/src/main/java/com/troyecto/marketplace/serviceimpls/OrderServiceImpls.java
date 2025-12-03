package com.troyecto.marketplace.serviceimpls;

import com.troyecto.marketplace.dtos.order.OrderRequest;
import com.troyecto.marketplace.dtos.order.OrderResponse;
import com.troyecto.marketplace.entities.Order;
import com.troyecto.marketplace.entities.User;
import com.troyecto.marketplace.exceptions.ResourceNotFoundException;
import com.troyecto.marketplace.mappers.OrderMapper;
import com.troyecto.marketplace.repositories.OrderRepository;
import com.troyecto.marketplace.repositories.UserRepository;
import com.troyecto.marketplace.services.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderServiceImpls implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {
        User user=userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Order order=orderMapper.mapOrderRequestToOrder(orderRequest);
        order.setOrderDate(LocalDateTime.now());
        order.setUser(user);
        Order savedOrder=orderRepository.save(order);
        return orderMapper.mapOrderToOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse updateOrder(Long id, OrderRequest orderRequest) {
        Order  order=orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User user=userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        orderMapper.updateOrderFromRequest(orderRequest,order);
        order.setUser(user);
        Order updatedOrder=orderRepository.save(order);
        return orderMapper.mapOrderToOrderResponse(updatedOrder);
    }

    @Override
    public String deleteOrder(Long id) {
        Order order=orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        orderRepository.delete(order);
        return "Order deleted with id " + id;
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order=orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return orderMapper.mapOrderToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::mapOrderToOrderResponse)
                .collect(Collectors.toList());
    }
}