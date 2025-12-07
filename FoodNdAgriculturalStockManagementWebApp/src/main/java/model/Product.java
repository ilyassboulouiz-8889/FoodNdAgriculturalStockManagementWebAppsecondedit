package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    private String name;
    private String description;
    private String category;
    private LocalDateTime  harvestDate;
    private LocalDateTime  createdAt;
    private LocalDateTime updatedAt;
    private double storageTemperature;
    private double storageHumidity;
    @Enumerated(EnumType.STRING)
    private CurrentStatus status;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductStatusHistory> history;

    public Product() {}
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    public  int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public User getOwner() {
        return owner;
    }
    public void setOwner(User owner) {
        this.owner = owner;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public LocalDateTime  getHarvestDate() {
        return harvestDate;
    }
    public void setHarvestDate(LocalDateTime  harvestDate) {
        this.harvestDate = harvestDate;
    }
    public LocalDateTime  getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime  createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime  getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime  updatedAt) {
        this.updatedAt = updatedAt;
    }
    public double getStorageTemperature() {
        return storageTemperature;
    }
    public void setStorageTemperature(double storageTemperature) {
        this.storageTemperature = storageTemperature;
    }
    public double getStorageHumidity() {
        return storageHumidity;
    }
    public void setStorageHumidity(double storageHumidity) {
        this.storageHumidity = storageHumidity;
    }
    public List<ProductStatusHistory> getHistory() {
        return history;
    }
    public void setHistory(List<ProductStatusHistory> history) {
        this.history = history;
    }
    public CurrentStatus getStatus() {
        return status;
    }
    public void setStatus(CurrentStatus status) {
        this.status = status;
    }

}
