package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Order;
import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.payload.OrderRequest;
import com.elstore.storebackend.repository.OrderRepository;
import com.elstore.storebackend.repository.ProductRepository;
import com.elstore.storebackend.repository.UserRepository;
import com.elstore.storebackend.repository.CouponRepository;
import com.elstore.storebackend.repository.LoyaltyLevelRepository;
import com.elstore.storebackend.entity.Coupon;
import com.elstore.storebackend.entity.LoyaltyLevel;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private LoyaltyLevelRepository loyaltyLevelRepository;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        // Проверяем доступность товаров и обновляем остатки
        Map<Long, Integer> counts = new HashMap<>();
        for (Long prodId : request.getProductIds()) {
            counts.merge(prodId, 1, Integer::sum);
        }
        List<Product> products = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : counts.entrySet()) {
            Long prodId = entry.getKey();
            int qty = entry.getValue();
            Product p = productRepository.findById(prodId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", prodId));
            if (p.getStock() < qty) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Товар " + p.getName() + " доступен в количестве " + p.getStock());
            }
            p.setStock(p.getStock() - qty);
            productRepository.save(p);
            for (int i = 0; i < qty; i++) {
                products.add(p);
            }
        }
        // Применение купона
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid coupon code"));
            if (!coupon.isActive() || (coupon.getExpirationDate() != null && coupon.getExpirationDate().isBefore(LocalDateTime.now()))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coupon is inactive or expired");
            }
            discount = coupon.getDiscount();
            coupon.setActive(false);
            couponRepository.save(coupon);
        }
        BigDecimal totalBeforeDiscount = products.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Скидка по уровню лояльности
        BigDecimal totalSpent = orderRepository.getTotalSpentByUser(user);
        LoyaltyLevel level = loyaltyLevelRepository.findFirstByMinTotalLessThanEqualOrderByMinTotalDesc(totalSpent);
        BigDecimal loyaltyDiscount = BigDecimal.ZERO;
        if (level != null) {
            loyaltyDiscount = totalBeforeDiscount.multiply(level.getDiscountPercent()).divide(BigDecimal.valueOf(100));
        }
        BigDecimal total = totalBeforeDiscount.subtract(discount).subtract(loyaltyDiscount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }
        Order order = new Order();
        order.setUser(user);
        order.setProducts(products);
        order.setTotalPrice(total);
        order.setOrderDate(Instant.now());
        order.setDeliveryAddress(request.getDeliveryAddress());
        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Order> getAllOrders(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return orderRepository.findAll();
    }

    @GetMapping("/me")
    public List<Order> getUserOrders(Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return orderRepository.findByUser(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        if (!isAdmin && !order.getUser().getUsername().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // Return stock for each product in the canceled order
        for (Product p : order.getProducts()) {
            p.setStock(p.getStock() + 1);
            productRepository.save(p);
        }
        orderRepository.delete(order);
        return ResponseEntity.noContent().build();
    }

    /** Обновление заказа */
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id,
                                           @RequestBody OrderRequest request,
                                           Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        if (!isAdmin && !order.getUser().getUsername().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // Stock adjustment when editing: restore removed and deduct added
        List<Product> oldProducts = new ArrayList<>(order.getProducts());
        List<Product> newProducts = new ArrayList<>();
        for (Long prodId : request.getProductIds()) {
            Product p = productRepository.findById(prodId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", prodId));
            newProducts.add(p);
        }
        Map<Long, Integer> oldCounts = new HashMap<>();
        for (Product p : oldProducts) {
            oldCounts.merge(p.getId(), 1, Integer::sum);
        }
        Map<Long, Integer> newCounts = new HashMap<>();
        for (Product p : newProducts) {
            newCounts.merge(p.getId(), 1, Integer::sum);
        }
        // Restore stock for removed items
        for (Map.Entry<Long, Integer> entry : oldCounts.entrySet()) {
            int removed = entry.getValue() - newCounts.getOrDefault(entry.getKey(), 0);
            if (removed > 0) {
                Product prod = productRepository.findById(entry.getKey()).get();
                prod.setStock(prod.getStock() + removed);
                productRepository.save(prod);
            }
        }
        // Deduct stock for added items
        for (Map.Entry<Long, Integer> entry : newCounts.entrySet()) {
            int added = entry.getValue() - oldCounts.getOrDefault(entry.getKey(), 0);
            if (added > 0) {
                Product prod = productRepository.findById(entry.getKey()).get();
                if (prod.getStock() < added) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + prod.getName());
                }
                prod.setStock(prod.getStock() - added);
                productRepository.save(prod);
            }
        }
        order.setProducts(newProducts);
        BigDecimal total = newProducts.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(total);
        order.setDeliveryAddress(request.getDeliveryAddress());
        Order updated = orderRepository.save(order);
        return ResponseEntity.ok(updated);
    }
}
