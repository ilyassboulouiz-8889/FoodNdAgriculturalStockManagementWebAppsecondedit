package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.AuthResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.service.AuthService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ✅ now returns AuthResponseDTO (token + user)
    @PostMapping("/register")
    public AuthResponseDTO register(@RequestBody UserRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody UserRequestDTO request) {
        return authService.login(request.getEmail(), request.getPassword());
    }


}
