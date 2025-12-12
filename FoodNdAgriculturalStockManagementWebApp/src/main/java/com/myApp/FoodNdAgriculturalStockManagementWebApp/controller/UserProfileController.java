// src/main/java/com/myApp/FoodNdAgriculturalStockManagementWebApp/controller/UserProfileController.java
package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UpdateProfileRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserProfileDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/users/profile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    // GET /users/me  -> current user profile
    @GetMapping
    public UserProfileDTO getProfile(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found with email: " + email
                ));

        return new UserProfileDTO(user);
    }

    // PUT /users/me  -> update profile (currently: fullname only)
    @PutMapping
    public UserProfileDTO updateProfile(@RequestBody UpdateProfileRequestDTO req,
                                        Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found with email: " + email
                ));

        if (req.getFullname() != null && !req.getFullname().isBlank()) {
            user.setFullname(req.getFullname().trim());
        }

        User saved = userRepository.save(user);
        return new UserProfileDTO(saved);
    }
}
