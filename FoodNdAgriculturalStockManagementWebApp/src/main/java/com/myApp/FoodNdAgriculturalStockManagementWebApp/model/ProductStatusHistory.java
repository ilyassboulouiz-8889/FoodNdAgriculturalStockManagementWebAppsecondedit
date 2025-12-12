package com.myApp.FoodNdAgriculturalStockManagementWebApp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "product_status_history")
public class ProductStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    private CurrentStatus newStatus;

    private LocalDateTime changedAt;
    public ProductStatusHistory() {}
    @PrePersist
    protected void onCreate() {
        changedAt = LocalDateTime.now();
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }
    public void setProduct(Product product) {
        this.product = product;
    }
    public CurrentStatus getNewStatus() {
        return newStatus;
    }
    public void setNewStatus(CurrentStatus newStatus) {
        this.newStatus = newStatus;
    }
    public LocalDateTime getChangedAt() {
        return changedAt;
    }
    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

}
