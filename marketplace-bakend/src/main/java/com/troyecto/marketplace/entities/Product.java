package com.troyecto.marketplace.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data // Incluye Getters, Setters, equals, hashCode, toString (Lombok)
@NoArgsConstructor
@AllArgsConstructor
@lombok.Builder
@Table(name = "products") // Mapea a una tabla llamada 'products'
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private BigDecimal price;
    @Column(nullable = false)
    private Integer stock;
    //@Column(nullable = false)
    private LocalDateTime publishedDate;
    private Boolean isAvailable;
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name="store_id",
            nullable = false,
            foreignKey = @ForeignKey(name="fk_product_store"))
    @JsonBackReference
    private Store store;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @lombok.Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    public void  addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setProduct(this);
    }
    // - Importante: se actualizan ambas referencias (lista y orderItem.product) para mantener la consistencia
    //   y que JPA detecte correctamente los cambios.

    public void  removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setProduct(null);
    }
    // - Al quitar, además de eliminar de la lista, se rompe la referencia al padre. Con orphanRemoval=true
    //   JPA borrará el registro si persiste así.

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    @lombok.Builder.Default
    private List<Review> reviews = new ArrayList<>();
    // - Misma lógica que en orderItems: colección administrada por Product.

    public void  addReview(Review review) {
        reviews.add(review);
        review.setProduct(this);
    }
    public void  removeReview(Review review) {
        reviews.remove(review);
        review.setProduct(null);
    }
}