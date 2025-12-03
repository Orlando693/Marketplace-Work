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
@Data // Incluye Getters, Setters, toString, equals y hashCode (gracias a Lombok)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "stores") // Mapea a una tabla llamada 'stores' en la base de datos
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Nombre de la tienda (debe ser único para evitar duplicados)
    @Column(nullable = false, unique = true)
    private String name;
    private String description;
    // Categoría de la tienda (ej. Electrónica, Ropa, Libros)
    @Column(nullable = false)
    private String category;
    // Fecha de creación de la tienda
    @Column(nullable = false)
    private LocalDateTime createdDate;
    // Campo para saber si la tienda está activa o suspendida
    private Boolean isActive;
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",
            nullable = false,
            foreignKey =@ForeignKey(name ="fk_store_user"))
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy ="store",cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Product> products=new ArrayList<>();
    // - Se inicializa la lista para evitar NullPointerException al añadir/quitar elementos.
    // - orphanRemoval = true: si un Product se elimina de esta lista y no está referenciado en otra parte,
    //   JPA lo borrará de la BD al persistir.
    public void  addProduct(Product product) {
        products.add(product);
        product.setStore(this);
    }
    // - Mantener ambas referencias (añadir a la lista y setear store en Product) es crucial para que JPA
    //   detecte correctamente los cambios en la relación bidireccional.
    public void  removeProduct(Product product) {
        products.remove(product);
        product.setStore(null);
    }
}