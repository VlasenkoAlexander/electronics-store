package com.elstore.storebackend.controller;

import com.elstore.storebackend.payload.CustomerSales;
import com.elstore.storebackend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/customer-sales")
public class CustomerSalesController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<CustomerSales> getCustomerSales(@RequestParam("from") Instant from,
                                                @RequestParam("to") Instant to) {
        return orderRepository.findCustomerSalesBetween(from, to);
    }
}
