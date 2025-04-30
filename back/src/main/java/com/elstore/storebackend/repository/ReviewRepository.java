package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Review;
import com.elstore.storebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r")
    BigDecimal getAverageRating();
}
