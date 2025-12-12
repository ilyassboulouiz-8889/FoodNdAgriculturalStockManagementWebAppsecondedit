package com.myApp.FoodNdAgriculturalStockManagementWebApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "com.myApp.FoodNdAgriculturalStockManagementWebApp", // root
                "controller",
                "service",
                "repository",
                "security",
                "dto",
                "model"
        }
)
public class FoodNdAgriculturalStockManagementWebAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoodNdAgriculturalStockManagementWebAppApplication.class, args);
    }
}
