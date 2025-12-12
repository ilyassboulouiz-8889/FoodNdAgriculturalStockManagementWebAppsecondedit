package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class AdminUserResponseDTO {
    private int id;
    private String fullname;
    private String email;
    private String role;

    public AdminUserResponseDTO(int id, String fullname, String email, String role) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
    }

    public int getId() { return id; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
