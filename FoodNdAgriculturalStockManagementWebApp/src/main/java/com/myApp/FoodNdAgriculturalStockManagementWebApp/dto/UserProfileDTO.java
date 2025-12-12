// src/main/java/com/myApp/FoodNdAgriculturalStockManagementWebApp/dto/UserProfileDTO.java
package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;

public class UserProfileDTO {
    private int id;
    private String fullname;
    private String email;
    private String role;

    public UserProfileDTO() {}

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.fullname = user.getFullname();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole().name() : null;
    }

    public int getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
