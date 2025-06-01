package com.elstore.storebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSales {
    private Long productId;
    private String productName;
    private Long quantitySold;
}
