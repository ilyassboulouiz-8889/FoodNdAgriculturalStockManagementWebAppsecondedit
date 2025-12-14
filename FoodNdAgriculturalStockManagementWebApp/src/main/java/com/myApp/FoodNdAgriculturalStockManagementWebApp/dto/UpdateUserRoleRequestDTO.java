package com.myApp.FoodNdAgriculturalStockManagementWebApp.dto;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;

public class UpdateUserRoleRequestDTO {
    private Role role;
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
