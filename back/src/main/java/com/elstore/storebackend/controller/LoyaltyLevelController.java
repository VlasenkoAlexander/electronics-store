package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.LoyaltyLevel;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.repository.LoyaltyLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/loyalty-levels")
public class LoyaltyLevelController {

    @Autowired
    private LoyaltyLevelRepository loyaltyLevelRepository;

    /** List all loyalty levels (admin only) */
    @GetMapping
    public List<LoyaltyLevel> getAllLevels(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return loyaltyLevelRepository.findAll();
    }

    /** Create a new loyalty level (admin only) */
    @PostMapping
    public LoyaltyLevel createLevel(@RequestBody LoyaltyLevel level, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return loyaltyLevelRepository.save(level);
    }

    /** Update an existing loyalty level (admin only) */
    @PutMapping("/{id}")
    public LoyaltyLevel updateLevel(@PathVariable Long id, @RequestBody LoyaltyLevel levelDetails, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        LoyaltyLevel level = loyaltyLevelRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("LoyaltyLevel", "id", id));
        level.setName(levelDetails.getName());
        level.setMinTotal(levelDetails.getMinTotal());
        level.setDiscountPercent(levelDetails.getDiscountPercent());
        return loyaltyLevelRepository.save(level);
    }

    /** Delete a loyalty level (admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        LoyaltyLevel level = loyaltyLevelRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("LoyaltyLevel", "id", id));
        loyaltyLevelRepository.delete(level);
        return ResponseEntity.noContent().build();
    }
}
