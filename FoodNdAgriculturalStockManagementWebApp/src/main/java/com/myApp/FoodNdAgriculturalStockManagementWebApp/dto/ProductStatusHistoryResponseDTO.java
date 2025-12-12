package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;

import java.time.LocalDateTime;

public class ProductStatusHistoryResponseDTO {
    private int id;
    private CurrentStatus newStatus;
    private LocalDateTime changedAt;
    private String imageUrl;

    public ProductStatusHistoryResponseDTO(int id, CurrentStatus newStatus, LocalDateTime changedAt,  String imageUrl) {
        this.id = id;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
        this.imageUrl = imageUrl;
    }

    public int getId() { return id; }
    public CurrentStatus getNewStatus() { return newStatus; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getImageUrl() { return imageUrl; }
    public void setId(int id) { this.id = id; }
}
