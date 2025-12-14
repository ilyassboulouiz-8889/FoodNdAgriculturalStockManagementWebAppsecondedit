package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Product;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.ProductStatusHistory;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.StatusChangeSource;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.ProductRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.ProductStatusHistoryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ProductShelfLifeScheduler {

    private final ProductRepository productRepository;
    private final ProductStatusHistoryRepository historyRepo;

    // how long we respect manual changes before auto can touch again
    private static final Duration MANUAL_LOCK = Duration.ofHours(6);

    public ProductShelfLifeScheduler(ProductRepository productRepository,
                                     ProductStatusHistoryRepository historyRepo) {
        this.productRepository = productRepository;
        this.historyRepo = historyRepo;
    }

    @Scheduled(fixedRate = 30 * 60 * 1000) // every 30 min
    public void updateStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Product> products = productRepository.findAll();

        for (Product p : products) {
            if (p == null) continue;
            if (p.isDeleted()) continue;
            if (p.getExpiresAt() == null) continue;

            // 1) expired always forces SPOILED
            if (!now.isBefore(p.getExpiresAt())) {
                forceStatusIfChanged(p, CurrentStatus.SPOILED, now, StatusChangeSource.AUTO);
                continue;
            }

            // 2) respect recent manual change
            if (isManuallyLocked(p.getId(), now)) {
                continue;
            }

            // 3) if near expiry, degrade to LOW_QUALITY (never upgrade)
            if (shouldBecomeLowQuality(p, now)) {
                if (p.getStatus() != CurrentStatus.SPOILED && p.getStatus() != CurrentStatus.LOW_QUALITY) {
                    forceStatusIfChanged(p, CurrentStatus.LOW_QUALITY, now, StatusChangeSource.AUTO);
                }
            }
        }
    }

    private boolean isManuallyLocked(int productId, LocalDateTime now) {
        // NOTE: you MUST implement this repository method to return 1 latest record
        // Example signature:
        // List<ProductStatusHistory> findLatestByProductId(int productId);
        List<ProductStatusHistory> list = historyRepo.findLatestByProductId(productId);
        if (list == null || list.isEmpty()) return false;

        ProductStatusHistory last = list.get(0);
        if (last.getChangedBy() != StatusChangeSource.USER) return false;

        LocalDateTime t = last.getChangedAt();
        if (t == null) return false;

        return Duration.between(t, now).compareTo(MANUAL_LOCK) < 0;
    }

    private boolean shouldBecomeLowQuality(Product p, LocalDateTime now) {
        // progress-based threshold (category aware)
        LocalDateTime start = (p.getHarvestDate() != null) ? p.getHarvestDate() : p.getCreatedAt();
        if (start == null) return false;

        long totalMinutes = Duration.between(start, p.getExpiresAt()).toMinutes();
        if (totalMinutes <= 0) return true;

        long elapsedMinutes = Duration.between(start, now).toMinutes();
        double progress = Math.min(1.0, Math.max(0.0, (double) elapsedMinutes / totalMinutes));

        // optional: storage penalty (makes it reach threshold sooner)
        progress = applyStoragePenalty(p, progress);

        String cat = (p.getCategory() == null) ? "" : p.getCategory().toUpperCase();

        // tune thresholds
        if (cat.equals("FRUIT") || cat.equals("VEGETABLE")) {
            return progress >= 0.70; // last 30% => low quality risk
        }
        if (cat.equals("CEREAL")) {
            return progress >= 0.90; // cereals degrade late
        }
        return progress >= 0.80;
    }

    private double applyStoragePenalty(Product p, double progress) {
        String cat = (p.getCategory() == null) ? "" : p.getCategory().toUpperCase();
        double temp = p.getStorageTemperature();
        double hum = p.getStorageHumidity();

        double factor = 1.0;

        if (cat.equals("FRUIT") || cat.equals("VEGETABLE")) {
            if (temp > 8) factor *= 1.15;
            if (temp > 15) factor *= 1.25;
            if (hum < 30) factor *= 1.05;
        }

        if (cat.equals("CEREAL")) {
            if (hum > 70) factor *= 1.25;
            if (hum > 80) factor *= 1.40;
            if (temp > 30) factor *= 1.10;
        }

        return Math.min(1.0, progress * factor);
    }

    private void forceStatusIfChanged(Product p, CurrentStatus target, LocalDateTime now, StatusChangeSource source) {
        if (p.getStatus() == target) return;

        p.setStatus(target);
        p.setUpdatedAt(now);

        ProductStatusHistory h = new ProductStatusHistory();
        h.setProduct(p);
        h.setNewStatus(target);
        h.setChangedAt(now);
        h.setChangedBy(source);

        historyRepo.save(h);
        productRepository.save(p);
    }
}
