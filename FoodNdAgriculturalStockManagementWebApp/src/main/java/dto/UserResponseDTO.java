package dto;

public class UserResponseDTO {
    private int id;
    private String fullname;
    private String email;

    // Constructor
    public UserResponseDTO(int id, String fullname, String email) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
    }

    // Getters
    public int getId() { return id; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
}
