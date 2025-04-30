package com.elstore.storebackend.entity;

import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import com.elstore.storebackend.entity.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import com.elstore.storebackend.entity.Review;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "model", nullable = false)
    private String name;
    @Column(length = 1000)
    private String description;
    private BigDecimal price;
    @Column(length = 1000)
    private String imageUrl;
    private String category;
    private int stock;
    @Column(nullable = false)
    private String brand;

    @JsonIgnore
    @ManyToMany(mappedBy = "products")
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Review> reviews = new ArrayList<>();

    @PreRemove
    private void preRemove() {
        for (Order order : orders) {
            order.getProducts().remove(this);
        }
    }
}
