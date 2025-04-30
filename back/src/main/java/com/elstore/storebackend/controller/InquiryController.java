package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Inquiry;
import com.elstore.storebackend.entity.User;
import com.elstore.storebackend.exception.ResourceNotFoundException;
import com.elstore.storebackend.repository.InquiryRepository;
import com.elstore.storebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public List<Inquiry> getMyInquiries(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        return inquiryRepository.findByUser(user);
    }

    @GetMapping
    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(@RequestBody Inquiry inquiryRequest, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", auth.getName()));
        Inquiry inquiry = Inquiry.builder()
                .subject(inquiryRequest.getSubject())
                .message(inquiryRequest.getMessage())
                .createdAt(Instant.now())
                .user(user)
                .build();
        Inquiry saved = inquiryRepository.save(inquiry);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{inquiryId}/response")
    public ResponseEntity<Inquiry> respondInquiry(@PathVariable Long inquiryId,
                                                  @RequestBody String response) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry", "id", inquiryId));
        inquiry.setResponse(response);
        inquiry.setRespondedAt(Instant.now());
        Inquiry updated = inquiryRepository.save(inquiry);
        return ResponseEntity.ok(updated);
    }
}
