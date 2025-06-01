package com.elstore.storebackend.controller;

import com.elstore.storebackend.entity.Product;
import com.elstore.storebackend.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateProduct() throws Exception {
        Product product = new Product(null, "TestModel", "Desc", BigDecimal.valueOf(100),
                "url", "category", 10, "brand", Collections.emptyList(), Collections.emptyList());
        Product savedProduct = new Product(1L, "TestModel", "Desc", BigDecimal.valueOf(100),
                "url", "category", 10, "brand", Collections.emptyList(), Collections.emptyList());

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("TestModel"));

        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testUpdateProduct() throws Exception {
        Long id = 1L;
        Product existingProduct = new Product(1L, "OldModel", "OldDesc", BigDecimal.valueOf(50),
                "oldUrl", "oldCategory", 5, "oldBrand", Collections.emptyList(), Collections.emptyList());
        Product updatedDetails = new Product(null, "NewModel", "NewDesc", BigDecimal.valueOf(150),
                "newUrl", "newCategory", 15, "newBrand", Collections.emptyList(), Collections.emptyList());
        Product updatedProduct = new Product(1L, "NewModel", "NewDesc", BigDecimal.valueOf(150),
                "newUrl", "newCategory", 15, "newBrand", Collections.emptyList(), Collections.emptyList());

        when(productRepository.findById(id)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("NewModel"));

        verify(productRepository).findById(id);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testDeleteProduct() throws Exception {
        Long id = 1L;
        Product existingProduct = new Product(1L, "TestModel", "Desc", BigDecimal.valueOf(100),
                "url", "category", 10, "brand", Collections.emptyList(), Collections.emptyList());

        when(productRepository.findById(id)).thenReturn(Optional.of(existingProduct));

        mockMvc.perform(delete("/api/products/{id}", id))
                .andExpect(status().isNoContent());

        verify(productRepository).findById(id);
        verify(productRepository).delete(existingProduct);
    }

    @Test
    void testSearchProducts() throws Exception {
        String search = "test";
        Product p1 = new Product(1L, "TestModel", "Desc", BigDecimal.valueOf(100),
                "url", "cat", 10, "Brand", Collections.emptyList(), Collections.emptyList());
        List<Product> resultList = Arrays.asList(p1);

        when(productRepository.findByBrandContainingIgnoreCaseOrNameContainingIgnoreCase(eq(search), eq(search)))
                .thenReturn(resultList);

        mockMvc.perform(get("/api/products")
                        .param("search", search))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("TestModel"));

        verify(productRepository).findByBrandContainingIgnoreCaseOrNameContainingIgnoreCase(eq(search), eq(search));
    }
}
