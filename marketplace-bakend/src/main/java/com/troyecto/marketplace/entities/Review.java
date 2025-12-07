package com.troyecto.marketplace.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@lombok.Builder
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Integer rating;
    @Column(nullable = false)
    private String comment;
    //@Column(nullable = false)
    private LocalDateTime createdAt;
    //@Column(nullable = false)
    private LocalDateTime updatedAt;
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",
            nullable = false,
            foreignKey =@ForeignKey(name ="fk_review_user"))
    @JsonBackReference
    private User user;
    // - @JsonBackReference: evita recursión infinita al serializar User <-> Review. La entidad User debe tener la anotación complementaria.
    @ManyToOne(fetch = FetchType.LAZY,optional=false)
    @JoinColumn(name = "product_id",
            nullable = false,
            foreignKey =@ForeignKey(name ="fk_review_product"))
    @JsonBackReference
    private Product product;
    // - Igual que con user: la relación con Product es perezosa. En mapeos a DTO se debe comprobar null y/o inicializar la relación dentro del servicio.
}
