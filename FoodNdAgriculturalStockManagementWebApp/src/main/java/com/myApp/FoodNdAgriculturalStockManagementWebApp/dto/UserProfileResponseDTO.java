package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;// package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class UserProfileResponseDTO {
    private Integer id;
    private String fullname;
    private String email;
    private String role;
    private String avatarUrl;

    public UserProfileResponseDTO(Integer id, String fullname, String email, String role, String avatarUrl) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    public Integer getId() {
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

    public String getAvatarUrl() {
        return avatarUrl;
    }
}
