package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ProductResponseDTO {
    private int id;
    private String name;
    private String description;
    private String category;
    private LocalDateTime harvestDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private double storageTemperature;
    private double storageHumidity;
    private CurrentStatus status;
    private List<ProductStatusHistoryResponseDTO> history;
    private  String imageUrl;

    // Constructor
    public ProductResponseDTO(int id, String name, String description, String category,
                              LocalDateTime harvestDate, LocalDateTime createdAt, LocalDateTime updatedAt,
                              double storageTemperature, double storageHumidity, CurrentStatus status,
                              List<ProductStatusHistoryResponseDTO> history,  String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.harvestDate = harvestDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.storageTemperature = storageTemperature;
        this.storageHumidity = storageHumidity;
        this.status = status;
        this.history = history;
        this.imageUrl = imageUrl;
    }

    // Getters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public LocalDateTime getHarvestDate() { return harvestDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public double getStorageTemperature() { return storageTemperature; }
    public double getStorageHumidity() { return storageHumidity; }
    public CurrentStatus getStatus() { return status; }
    public List<ProductStatusHistoryResponseDTO> getHistory() { return history; }
    public String getImageUrl() { return imageUrl; }

}
