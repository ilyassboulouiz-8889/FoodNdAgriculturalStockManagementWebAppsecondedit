package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;

public class AdminUserResponseDTO {

    private int id;
    private String fullname;
    private String email;
    private Role role;
    private boolean deleted;
    private String createdAt; // ✅ matches your User.createdAt (String)

    public AdminUserResponseDTO(int id, String fullname, String email, Role role, boolean deleted, String createdAt) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
        this.deleted = deleted;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public boolean isDeleted() { return deleted; }
    public String getCreatedAt() { return createdAt; }
}
