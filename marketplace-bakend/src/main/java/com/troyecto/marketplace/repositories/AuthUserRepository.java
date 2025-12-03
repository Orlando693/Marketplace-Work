package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
    /**
     * Busca un usuario por su email (para login)
     */
    Optional<AuthUser> findByEmail(String email);
}
