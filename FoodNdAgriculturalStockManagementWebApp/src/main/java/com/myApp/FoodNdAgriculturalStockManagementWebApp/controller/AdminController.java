package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.AdminUserResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

//    @GetMapping("/users")
//    public List<AdminUserResponseDTO> getAllUsers() {
//        return userRepository.findAll().stream()
//                .map(u -> new AdminUserResponseDTO(
//                        u.getId(),
//                        u.getFullname(),
//                        u.getEmail(),
//                        u.getRole(),
//                        u.isDeleted(),
//                        u.getCreatedAt()
//                ))
//                .toList();
//    }
}
