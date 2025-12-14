package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;

import java.time.LocalDateTime;

public class ProductRequestDTO {
    private String name;
    private String description;
    private String category;
    private LocalDateTime harvestDate;
    private double storageTemperature;
    private double storageHumidity;
    private CurrentStatus status;
    private String imageUrl;
    private Integer shelfLifeDays;
    private Boolean shelfLifeAuto;
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDateTime getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDateTime harvestDate) { this.harvestDate = harvestDate; }
    public double getStorageTemperature() { return storageTemperature; }
    public void setStorageTemperature(double storageTemperature) { this.storageTemperature = storageTemperature; }
    public double getStorageHumidity() { return storageHumidity; }
    public void setStorageHumidity(double storageHumidity) { this.storageHumidity = storageHumidity; }
    public CurrentStatus getStatus() { return status; }
    public void setStatus(CurrentStatus status) { this.status = status; }
    public String getImageUrl() { return imageUrl; }       // ✅ ADD
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; } // ✅ ADD
    public Integer getShelfLifeDays() { return shelfLifeDays; }
    public void setShelfLifeDays(Integer shelfLifeDays) { this.shelfLifeDays = shelfLifeDays; }

    public Boolean getShelfLifeAuto() { return shelfLifeAuto; }
    public void setShelfLifeAuto(Boolean shelfLifeAuto) { this.shelfLifeAuto = shelfLifeAuto; }
}
