package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserProfileResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserProfileUpdateRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /users/{id}
    @GetMapping("/{id}")
    public UserResponseDTO get(@PathVariable int id) {
        User user = userService.getById(id);
        return new UserResponseDTO(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getAvatarUrl()
        );
    }

    // GET /users/
    @GetMapping("/")
    public List<UserResponseDTO> all() {
        return userService.getAll().stream()
                .map(u -> new UserResponseDTO(
                        u.getId(),
                        u.getFullname(),
                        u.getEmail(),
                        u.getAvatarUrl()
                ))
                .collect(Collectors.toList());
    }

    // GET /users/me
    @GetMapping("/me")
    public UserProfileResponseDTO getMe(Principal principal) {
        String email = principal.getName();
        User user = userService.getByEmail(email);
        return toDto(user);
    }

    // PUT /users/me
    @PutMapping("/me")
    public UserProfileResponseDTO updateMe(
            @RequestBody UserProfileUpdateRequestDTO dto,
            Principal principal
    ) {
        String email = principal.getName();
        User updated = userService.updateProfile(
                email,
                dto.getFullname(),
                dto.getAvatarUrl()
        );
        return toDto(updated);
    }

    private UserProfileResponseDTO toDto(User user) {
        return new UserProfileResponseDTO(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getAvatarUrl()
        );
    }
}
