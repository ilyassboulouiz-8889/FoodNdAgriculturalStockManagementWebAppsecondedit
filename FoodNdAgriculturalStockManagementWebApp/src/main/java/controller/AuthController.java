package controller;

import dto.AuthResponseDTO;
import dto.UserRequestDTO;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody UserRequestDTO request) {
        User user = new User();
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        return authService.register(user);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestParam String email,
                                 @RequestParam String password) {
        String token = authService.login(email, password);
        return new AuthResponseDTO(token);
    }
}
