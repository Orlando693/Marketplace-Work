package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.Product;
import com.troyecto.marketplace.entities.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query("SELECT e.store.name, COUNT(e) FROM Product e GROUP BY e.store.name")
    List<Object[]> countProductsByStore();
}
