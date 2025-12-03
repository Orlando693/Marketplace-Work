package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
