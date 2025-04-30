package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBrandContainingIgnoreCaseOrNameContainingIgnoreCase(String brand, String name);
}
