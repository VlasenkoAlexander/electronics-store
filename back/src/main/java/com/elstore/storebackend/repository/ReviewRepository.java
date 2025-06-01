package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Review;
import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.payload.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r")
    BigDecimal getAverageRating();
    @Query("SELECT new com.elstore.storebackend.payload.ProductRating(r.product.id, r.product.name, AVG(r.rating)) FROM Review r WHERE r.createdAt BETWEEN ?1 AND ?2 GROUP BY r.product.id, r.product.name ORDER BY AVG(r.rating) DESC")
    List<ProductRating> findProductRatingBetween(Instant from, Instant to);
}
