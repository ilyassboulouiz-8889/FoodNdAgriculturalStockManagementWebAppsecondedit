package dto;

import model.User;

public class AuthResponseDTO {
    private String token;
    private int userId;
    private String fullname;
    private String email;

    public AuthResponseDTO(String token, User user) {
        this.token = token;
        this.userId = user.getId();
        this.fullname = user.getFullname();
        this.email = user.getEmail();
    }

    // Getters
    public String getToken() { return token; }
    public int getUserId() { return userId; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
}
