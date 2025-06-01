package com.elstore.storebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRating {
    private Long productId;
    private String productName;
    private Double averageRating;
}
