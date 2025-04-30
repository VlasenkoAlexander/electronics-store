package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Coupon;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    /** Get all coupons (admin only) */
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Coupon> coupons = couponRepository.findAll();
        return ResponseEntity.ok(coupons);
    }

    /** Get coupon by ID (admin only) */
    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCoupon(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        return ResponseEntity.ok(coupon);
    }

    /** Create a new coupon (admin only) */
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Update coupon (admin only) */
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody Coupon couponDetails, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        if (couponDetails.getCode() != null) coupon.setCode(couponDetails.getCode());
        if (couponDetails.getDiscount() != null) coupon.setDiscount(couponDetails.getDiscount());
        coupon.setActive(couponDetails.isActive());
        if (couponDetails.getExpirationDate() != null) coupon.setExpirationDate(couponDetails.getExpirationDate());
        Coupon updated = couponRepository.save(coupon);
        return ResponseEntity.ok(updated);
    }

    /** Delete coupon (admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
        couponRepository.delete(coupon);
        return ResponseEntity.noContent().build();
    }

    /** Get coupon by code (public) */
    @GetMapping("/code/{code}")
    public ResponseEntity<Coupon> getByCode(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
        if (!coupon.isActive() || (coupon.getExpirationDate() != null && coupon.getExpirationDate().isBefore(LocalDateTime.now()))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(coupon);
    }
}
