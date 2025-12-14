package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.AdminUserResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UpdateUserRoleRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.service.AdminUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final UserRepository userRepository;

    public AdminUserController(AdminUserService adminUserService, UserRepository userRepository) {
        this.adminUserService = adminUserService;
        this.userRepository = userRepository;
    }

    private User requireAdmin(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");

        String email = principal.getName();
        User current = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (current.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "ADMIN only");
        }
        return current;
    }

    @GetMapping("/users")
    public List<AdminUserResponseDTO> listUsers(
            Principal principal,
            @RequestParam(required = false) String emailContains,
            @RequestParam(defaultValue = "ONLY_ACTIVE") String deletedFilter
    ) {
        requireAdmin(principal);

        return adminUserService.searchUsers(emailContains, deletedFilter)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList()); // ✅ avoids weird inference issues
    }

    @PutMapping("/users/{id}/role")
    public AdminUserResponseDTO updateRole(
            Principal principal,
            @PathVariable int id,
            @RequestBody UpdateUserRoleRequestDTO req
    ) {
        User admin = requireAdmin(principal);

        if (admin.getId() == id && req.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot remove your own ADMIN role.");
        }

        User updated = adminUserService.updateRole(id, req.getRole());
        return toDto(updated);
    }

    @PutMapping("/users/{id}/soft-delete")
    public AdminUserResponseDTO softDelete(Principal principal, @PathVariable int id) {
        requireAdmin(principal);
        return toDto(adminUserService.softDelete(id));
    }

    @PutMapping("/users/{id}/restore")
    public AdminUserResponseDTO restore(Principal principal, @PathVariable int id) {
        requireAdmin(principal);
        return toDto(adminUserService.restore(id));
    }

    private AdminUserResponseDTO toDto(User u) {
        return new AdminUserResponseDTO(
                u.getId(),
                u.getFullname(),
                u.getEmail(),
                u.getRole(),
                u.isDeleted(),
                u.getCreatedAt() // ✅ String
        );
    }
}
