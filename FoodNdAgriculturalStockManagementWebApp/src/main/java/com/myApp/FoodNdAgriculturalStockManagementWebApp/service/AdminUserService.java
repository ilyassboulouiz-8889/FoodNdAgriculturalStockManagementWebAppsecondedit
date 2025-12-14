package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> searchUsers(String emailContains, String deletedFilter) {
        // deletedFilter: ALL | ONLY_ACTIVE | ONLY_DELETED
        List<User> base = (emailContains != null && !emailContains.trim().isEmpty())
                ? userRepository.findByEmailContainingIgnoreCase(emailContains.trim())
                : userRepository.findAll();

        if (deletedFilter == null) deletedFilter = "ALL";

        String finalDeletedFilter = deletedFilter;
        return base.stream().filter(u -> {
            return switch (finalDeletedFilter) {
                case "ONLY_ACTIVE" -> !u.isDeleted();
                case "ONLY_DELETED" -> u.isDeleted();
                default -> true;
            };
        }).toList();
    }

    @Transactional
    public User updateRole(int userId, Role newRole) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (newRole == null) throw new IllegalArgumentException("Role cannot be null");

        u.setRole(newRole);
        return userRepository.save(u);
    }

    @Transactional
    public User softDelete(int userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        u.setDeleted(true);
        return userRepository.save(u);
    }

    @Transactional
    public User restore(int userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        u.setDeleted(false);
        return userRepository.save(u);
    }

    @Transactional
    public void hardDelete(int userId) {
        userRepository.deleteById(userId);
    }
}
