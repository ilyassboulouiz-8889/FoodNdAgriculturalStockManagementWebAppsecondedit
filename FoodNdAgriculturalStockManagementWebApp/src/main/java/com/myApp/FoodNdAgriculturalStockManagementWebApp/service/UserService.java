package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;// package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    // 👇 NEW: by email (from Principal/JWT)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));
    }

    // 👇 NEW: update profile (fullname + avatar)
    public User updateProfile(String email, String fullname, String avatarUrl) {
        User user = getByEmail(email);

        if (fullname != null && !fullname.isBlank()) {
            user.setFullname(fullname);
        }
        // avatarUrl can be null to “clear” avatar
        user.setAvatarUrl(avatarUrl);

        return userRepository.save(user);
    }
    public User save(User user) {
        return userRepository.save(user);
    }
}
