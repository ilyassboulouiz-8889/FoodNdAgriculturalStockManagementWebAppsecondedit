// src/main/java/com/myApp/FoodNdAgriculturalStockManagementWebApp/dto/UpdateProfileRequestDTO.java
package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class UpdateProfileRequestDTO {
    private String fullname;
    // later you can add phone, language, etc.

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
}
