package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.entity.Order;
import com.elstore.storebackend.entity.LoyaltyLevel;
import com.elstore.storebackend.repository.UserRepository;
import com.elstore.storebackend.repository.OrderRepository;
import com.elstore.storebackend.repository.LoyaltyLevelRepository;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.payload.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private LoyaltyLevelRepository loyaltyLevelRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /** Get all users (admin only) */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /** Delete a user by ID (admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        List<Order> orders = orderRepository.findByUser(user);
        // Clear join table entries before deleting orders to avoid FK constraints
        orders.forEach(order -> order.getProducts().clear());
        orderRepository.saveAll(orders);
        orderRepository.deleteAll(orders);
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }

    /** Get current user's profile */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getCurrentUser(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        // Calculate total spent
        BigDecimal totalSpent = orderRepository.getTotalSpentByUser(user);
        // Determine loyalty level
        LoyaltyLevel level = loyaltyLevelRepository.findFirstByMinTotalLessThanEqualOrderByMinTotalDesc(totalSpent);
        // Build response
        ProfileResponse resp = new ProfileResponse();
        resp.setId(user.getId());
        resp.setUsername(user.getUsername());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setFirstName(user.getFirstName());
        resp.setLastName(user.getLastName());
        resp.setMiddleName(user.getMiddleName());
        resp.setBirthDate(user.getBirthDate());
        resp.setPhone(user.getPhone());
        resp.setTotalSpent(totalSpent);
        if (level != null) {
            resp.setLoyaltyLevel(level.getName());
            resp.setDiscountPercent(level.getDiscountPercent());
        } else {
            resp.setLoyaltyLevel("None");
            resp.setDiscountPercent(BigDecimal.ZERO);
        }
        return ResponseEntity.ok(resp);
    }

    /** Update current user's profile */
    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User userDetails, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String newUsername = userDetails.getUsername();
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(username)) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken");
            }
            user.setUsername(newUsername);
        }

        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        // Optional profile fields
        if (userDetails.getFirstName() != null) user.setFirstName(userDetails.getFirstName());
        if (userDetails.getLastName() != null)  user.setLastName(userDetails.getLastName());
        if (userDetails.getMiddleName() != null) user.setMiddleName(userDetails.getMiddleName());
        if (userDetails.getBirthDate() != null)  user.setBirthDate(userDetails.getBirthDate());
        if (userDetails.getPhone() != null)      user.setPhone(userDetails.getPhone());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    /** Delete current user's account */
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        List<Order> orders = orderRepository.findByUser(user);
        orderRepository.deleteAll(orders);
        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}
