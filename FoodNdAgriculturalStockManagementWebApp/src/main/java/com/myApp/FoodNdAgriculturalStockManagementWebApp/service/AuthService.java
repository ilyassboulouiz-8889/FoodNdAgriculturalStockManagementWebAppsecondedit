package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.AuthResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.security.JwtUtility;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.UserRequestDTO;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtility jwtUtility;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public String register(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRole(Role.USER); // default role
        userRepository.save(user);
        return "User registered successfully";
    }

    // ✅ REGISTER and directly return token + user info
    public AuthResponseDTO register(UserRequestDTO request) {

        // Optional: prevent duplicate emails
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setAvatarUrl(request.getAvatarUrl());

        User saved = userRepository.save(user);

        // load UserDetails for JWT
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtUtility.generateToken(userDetails);

        return new AuthResponseDTO(token, saved, saved.getAvatarUrl());
    }

    // ✅ LOGIN (unchanged but now uses same DTO)
    public AuthResponseDTO login(String email, String password) {

        // verify credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        String token = jwtUtility.generateToken(userDetails);

        return new AuthResponseDTO(token, user, user.getAvatarUrl());
    }
}
