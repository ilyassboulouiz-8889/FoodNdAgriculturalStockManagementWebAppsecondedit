package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class UserRequestDTO {
    private String fullname;
    private String email;
    private String password;
    private String avatarUrl;

    // Getters and setters
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
