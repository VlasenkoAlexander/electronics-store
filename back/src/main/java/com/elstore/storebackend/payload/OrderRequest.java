package com.elstore.storebackend.payload;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<Long> productIds;
    private String deliveryAddress;
    private String couponCode;
}
