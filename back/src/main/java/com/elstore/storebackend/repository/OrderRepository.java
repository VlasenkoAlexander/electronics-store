package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Order;
import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.payload.CustomerSales;
import com.elstore.storebackend.payload.ProductSales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.user = :user")
    BigDecimal getTotalSpentByUser(User user);

    @Query("SELECT COALESCE(SUM(o.totalPrice),0) FROM Order o")
    BigDecimal getTotalSales();

    @Query("SELECT new com.elstore.storebackend.payload.ProductSales(p.id, p.name, COUNT(p)) FROM Order o JOIN o.products p WHERE o.orderDate BETWEEN ?1 AND ?2 GROUP BY p.id, p.name ORDER BY COUNT(p) DESC")
    List<ProductSales> findProductSalesBetween(Instant from, Instant to);

    @Query("SELECT new com.elstore.storebackend.payload.CustomerSales(u.id, u.username, SUM(o.totalPrice)) FROM Order o JOIN o.user u WHERE o.orderDate BETWEEN ?1 AND ?2 GROUP BY u.id, u.username ORDER BY SUM(o.totalPrice) DESC")
    List<CustomerSales> findCustomerSalesBetween(Instant from, Instant to);
}
