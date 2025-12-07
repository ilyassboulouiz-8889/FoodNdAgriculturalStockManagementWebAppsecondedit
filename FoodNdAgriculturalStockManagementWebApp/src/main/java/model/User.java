package model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String fullname;
    @Column(unique = true)
    private String email;
    private String passwordHash;
    private String role;
    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<Product> products;

    public User(int id, String fullname, String email, String passwordHash, String  role) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;

    }
    public User() {}
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getFullname() {
        return fullname;
    }
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public String  getRole() {
        return role;
    }
    public void setRole(String  role) {
        this.role = role;
    }
    public List<Product> getProducts() {
        return products;
    }
    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
