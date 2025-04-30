package com.elstore.storebackend.payload;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String middleName;
    private LocalDate birthDate;
    private String phone;

    private BigDecimal totalSpent;
    private String loyaltyLevel;
    private BigDecimal discountPercent;
}
