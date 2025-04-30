package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.repository.ProductRepository;
import com.elstore.storebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class WishlistController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    /** Получить список желаемого текущего пользователя */
    @GetMapping("/me/wishlist")
    public ResponseEntity<Set<Product>> getWishlist(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        return ResponseEntity.ok(user.getWishlist());
    }

    /** Добавить продукт в список желаемого */
    @PostMapping("/me/wishlist/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        user.getWishlist().add(product);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    /** Удалить продукт из списка желаемого */
    @DeleteMapping("/me/wishlist/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        user.getWishlist().removeIf(p -> p.getId().equals(productId));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }
}