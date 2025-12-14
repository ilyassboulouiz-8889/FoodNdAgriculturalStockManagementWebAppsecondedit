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
    private String imageUrl;
    private Integer shelfLifeDays;
    private LocalDateTime expiresAt;

    // ✅ ADD THIS (for soft delete)
    private boolean deleted;
    private String ownerFullname;
    private String ownerEmail;
    // ✅ UPDATED constructor (added deleted at the end)
    public ProductResponseDTO(
            int id,
            String name,
            String description,
            String category,
            LocalDateTime harvestDate,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            double storageTemperature,
            double storageHumidity,
            CurrentStatus status,
            List<ProductStatusHistoryResponseDTO> history,
            String imageUrl,
            Integer shelfLifeDays,
            LocalDateTime expiresAt,
            boolean deleted,
            String ownerFullname,
            String ownerEmail
    ) {
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
        this.shelfLifeDays = shelfLifeDays;
        this.expiresAt = expiresAt;
        this.deleted = deleted;
        this.ownerFullname = ownerFullname;
        this.ownerEmail = ownerEmail;
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
    public Integer getShelfLifeDays() { return shelfLifeDays; }
    public LocalDateTime getExpiresAt() { return expiresAt; }

    // ✅ NEW getter for frontend
    public boolean isDeleted() { return deleted; }

    // ✅ Optional setters (only if you need them)
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public String getOwnerFullname() { return ownerFullname; }
    public String getOwnerEmail() { return ownerEmail; }

}
