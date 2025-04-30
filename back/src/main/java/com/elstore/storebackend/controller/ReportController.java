package com.elstore.storebackend.controller;

import com.elstore.storebackend.payload.ReportSummary;
import com.elstore.storebackend.repository.OrderRepository;
import com.elstore.storebackend.repository.ReviewRepository;
import com.elstore.storebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReportController(OrderRepository orderRepository, UserRepository userRepository, ReviewRepository reviewRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/summary")
    public ReportSummary getSummary() {
        long totalOrders = orderRepository.count();
        BigDecimal totalSales = orderRepository.getTotalSales();
        long totalUsers = userRepository.count();
        BigDecimal avgOrderValue = totalOrders > 0
            ? totalSales.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        long totalReviews = reviewRepository.count();
        BigDecimal avgRating = reviewRepository.getAverageRating();
        return new ReportSummary(totalOrders, totalSales, totalUsers, avgOrderValue, totalReviews, avgRating);
    }
}
