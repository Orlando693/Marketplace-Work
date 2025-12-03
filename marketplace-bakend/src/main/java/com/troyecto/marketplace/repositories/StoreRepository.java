package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// La interfaz extiende JpaRepository, que ya da los métodos básicos: save, findAll, findById, delete, etc.
@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {

    // Método que implementa la lógica de negocio:
    // Permite verificar si ya existe una tienda con el mismo nombre (gracias a 'unique=true' en la entidad)
    // Es útil para validaciones antes de persistir una nueva tienda en la base de datos.
    boolean existsByName(String name);
}