package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.entity.Review;
import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.repository.ProductRepository;
import com.elstore.storebackend.repository.ReviewRepository;
import com.elstore.storebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Review> getReviews(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        return reviewRepository.findByProduct(product);
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody Review reviewRequest, Authentication auth) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        Review review = new Review();
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        review.setCreatedAt(Instant.now());
        review.setProduct(product);
        review.setUser(user);
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable Long productId,
                                               @PathVariable Long reviewId,
                                               @RequestBody Review reviewRequest,
                                               Authentication auth) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        if (!review.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Review", "id", reviewId);
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());
        Review updated = reviewRepository.save(review);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long productId,
                                             @PathVariable Long reviewId,
                                             Authentication auth) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        if (!review.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Review", "id", reviewId);
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        // Allow deletion if owner or admin
        boolean isOwner = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() != null && (user.getRole().equals("ADMIN") || user.getRole().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }
}
