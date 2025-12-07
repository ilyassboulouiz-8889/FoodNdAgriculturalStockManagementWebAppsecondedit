package dto;

import model.CurrentStatus;

import java.time.LocalDateTime;

public class ProductStatusHistoryResponseDTO {
    private int id;
    private CurrentStatus newStatus;
    private LocalDateTime changedAt;

    public ProductStatusHistoryResponseDTO(int id, CurrentStatus newStatus, LocalDateTime changedAt) {
        this.id = id;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
    }

    public int getId() { return id; }
    public CurrentStatus getNewStatus() { return newStatus; }
    public LocalDateTime getChangedAt() { return changedAt; }
}
