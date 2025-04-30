package com.elstore.storebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loyalty_levels")
public class LoyaltyLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "min_total", nullable = false)
    private BigDecimal minTotal;

    @Column(name = "discount_percent", nullable = false)
    private BigDecimal discountPercent;
}
