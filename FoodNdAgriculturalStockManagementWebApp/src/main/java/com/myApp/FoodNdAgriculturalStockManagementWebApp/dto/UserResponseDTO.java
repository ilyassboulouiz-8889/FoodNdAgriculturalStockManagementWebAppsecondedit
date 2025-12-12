package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class UserResponseDTO {
    private int id;
    private String fullname;
    private String email;
    private String avatarUrl;
    // Constructor
    public UserResponseDTO(int id, String fullname, String email, String avatarUrl) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.avatarUrl = avatarUrl;

    }

    // Getters
    public int getId() { return id; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getAvatarUrl() { return avatarUrl; }

}
