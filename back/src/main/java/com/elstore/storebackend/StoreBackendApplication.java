package com.elstore.storebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.elstore.storebackend")
public class StoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(StoreBackendApplication.class, args);
    }
}
