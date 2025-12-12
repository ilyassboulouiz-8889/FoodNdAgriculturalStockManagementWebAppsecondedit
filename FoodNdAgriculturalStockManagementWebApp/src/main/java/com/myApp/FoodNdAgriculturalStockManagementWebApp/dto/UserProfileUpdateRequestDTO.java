package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;// package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

public class UserProfileUpdateRequestDTO {
    private String fullname;
    private String avatarUrl; // optional

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
