package controller;

import dto.UserResponseDTO;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public UserResponseDTO get(@PathVariable int id) {
        User user = userService.getById(id);
        return new UserResponseDTO(user.getId(), user.getFullname(), user.getEmail());
    }

    @GetMapping("/")
    public List<UserResponseDTO> all() {
        return userService.getAll().stream()
                .map(u -> new UserResponseDTO(u.getId(), u.getFullname(), u.getEmail()))
                .collect(Collectors.toList());
    }
}
