package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}