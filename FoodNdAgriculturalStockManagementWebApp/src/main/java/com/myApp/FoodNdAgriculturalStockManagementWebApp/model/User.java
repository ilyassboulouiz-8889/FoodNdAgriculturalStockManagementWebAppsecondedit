package com.myApp.FoodNdAgriculturalStockManagementWebApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;

import java.util.List;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String fullname;
    @Column(unique = true)
    private String email;
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(name = "avatar_url")
    private String avatarUrl;
    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<Product> products;
    @Column(nullable = false)
    private boolean deleted = false;
    private String createdAt;
    public User(int id, String fullname, String email, String passwordHash, Role  role) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;

    }
    public User() {}
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getFullname() {
        return fullname;
    }
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public Role  getRole() {
        return role;
    }
    public void setRole(Role  role) {
        this.role = role;
    }
    public String getAvatarUrl() {
        return avatarUrl;
    }
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    public List<Product> getProducts() {
        return products;
    }
    public void setProducts(List<Product> products) {
        this.products = products;
    }
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    public String getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
