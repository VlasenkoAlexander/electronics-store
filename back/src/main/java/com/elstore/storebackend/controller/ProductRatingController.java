package com.elstore.storebackend.controller;

import com.elstore.storebackend.payload.ProductRating;
import com.elstore.storebackend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/admin/product-ratings")
public class ProductRatingController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<ProductRating> getProductRatings(@RequestParam("from") Instant from,
                                                 @RequestParam("to") Instant to) {
        return reviewRepository.findProductRatingBetween(from, to);
    }
}
