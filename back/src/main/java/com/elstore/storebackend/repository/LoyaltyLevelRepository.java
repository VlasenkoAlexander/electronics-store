package com.elstore.storebackend.repository;

import com.elstore.storebackend.entity.LoyaltyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface LoyaltyLevelRepository extends JpaRepository<LoyaltyLevel, Long> {
    // Find highest loyalty level for a given totalSpent
    LoyaltyLevel findFirstByMinTotalLessThanEqualOrderByMinTotalDesc(BigDecimal total);
}
