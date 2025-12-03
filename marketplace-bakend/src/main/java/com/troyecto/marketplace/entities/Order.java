package com.troyecto.marketplace.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    //@Column(nullable = false)
    //private String buyer;   //Cambiar despues a ManytoOne con user
    //@Column(nullable = false)
    //private String seller;  //Cambiar despues a ManytoOne con user
    //@Column(nullable = false)
    private Double subtotal;
    //@Column(nullable = false)
    private Integer totalAmount;
    @Column(nullable = false)
    private Double tax;
    @Column(nullable = false)
    private String currency;
    @Column(nullable = false)
    private String payMethod;
    @Column(nullable = false)
    private String paymentStatus;
    private LocalDateTime orderDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id",
                nullable = false,
                foreignKey = @ForeignKey(name = "fk_order_user"))
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<OrderItem> orderItems = new ArrayList<>();
    // Es importante mantener la consistencia de la relación bidireccional
    public void addOrderItem(OrderItem orderItem){
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    // - Mantener ambas referencias (lista y order en el OrderItem) evita inconsistencias y hace que JPA detecte correctamente cambios.
    public void removeOrderItem(OrderItem orderItem){
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }

    public void recalculateTotals() {
        this.subtotal = orderItems.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();

        this.totalAmount = orderItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
    }
   }
