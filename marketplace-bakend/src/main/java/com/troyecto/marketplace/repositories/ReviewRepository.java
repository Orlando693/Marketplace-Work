package com.troyecto.marketplace.repositories;

import com.troyecto.marketplace.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
