package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.Order;
import com.elstore.storebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.user = :user")
    BigDecimal getTotalSpentByUser(User user);

    @Query("SELECT COALESCE(SUM(o.totalPrice),0) FROM Order o")
    BigDecimal getTotalSales();
}
