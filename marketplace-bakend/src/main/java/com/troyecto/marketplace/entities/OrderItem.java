package com.troyecto.marketplace.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@lombok.Builder
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private int quantity;
    @Column(nullable = false)
    private double price;
    @Column(nullable = false)
    private double subtotal;

    // cambiar por una relacion con order
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_orderItem_order"))
    @JsonBackReference
    private Order order;

    //private String product; //cambiar por una relacion con product
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_orderItem_product"))
    @JsonBackReference
    private Product product;
}
