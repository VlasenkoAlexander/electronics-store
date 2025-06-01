package com.elstore.storebackend.controller;

import com.elstore.storebackend.payload.ProductSales;
import com.elstore.storebackend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/sales")
public class SalesController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<ProductSales> getProductSales(@RequestParam("from") Instant from,
                                              @RequestParam("to") Instant to) {
        return orderRepository.findProductSalesBetween(from, to);
    }
}
