package service;

import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }
}
