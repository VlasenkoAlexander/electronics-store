package com.elstore.storebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSales {
    private Long userId;
    private String username;
    private BigDecimal totalSpent;
}
