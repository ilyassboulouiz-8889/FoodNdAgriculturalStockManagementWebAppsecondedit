package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;

public class AuthResponseDTO {

    private String token;
    private int userId;
    private String fullname;
    private String email;
    private String role; // String so it's easy for frontend (e.g. "ADMIN", "USER")
    private String avatarUrl;

    public AuthResponseDTO(String token, User user, String avatarUrl) {
        this.token = token;
        this.userId = user.getId();
        this.fullname = user.getFullname();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.avatarUrl = avatarUrl;
    }

    public String getToken() {
        return token;
    }

    public int getUserId() {
        return userId;
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
    public String getAvatarUrl() { return avatarUrl; }

    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

}
