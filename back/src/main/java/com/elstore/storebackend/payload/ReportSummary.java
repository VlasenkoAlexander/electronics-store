package com.elstore.storebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummary {
    private long totalOrders;
    private BigDecimal totalSales;
    private long totalUsers;
    private BigDecimal avgOrderValue;
    private long totalReviews;
    private BigDecimal avgRating;
}
