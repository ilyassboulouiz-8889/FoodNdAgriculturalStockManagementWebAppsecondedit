// ShelfLifeRules.java
package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;
import org.springframework.stereotype.Component;

@Component
public class ShelfLifeRules {

    public int resolveDays(String category, CurrentStatus status) {
        String c = category == null ? "" : category.toUpperCase();

        return switch (c) {
            case "CEREAL" -> switch (status) {
                case FRESH -> 180;
                case DRY -> 365;
                case RIPE -> 120;        // not common but safe fallback
                case LOW_QUALITY -> 30;
                case SPOILED -> 0;
            };
            case "FRUIT" -> switch (status) {
                case FRESH -> 10;
                case RIPE -> 4;
                case DRY -> 30;          // dried fruit
                case LOW_QUALITY -> 2;
                case SPOILED -> 0;
            };
            case "VEGETABLE" -> switch (status) {
                case FRESH -> 14;
                case RIPE -> 7;
                case DRY -> 90;          // dried veggies / herbs
                case LOW_QUALITY -> 3;
                case SPOILED -> 0;
            };
            default -> switch (status) {
                case FRESH -> 7;
                case RIPE -> 3;
                case DRY -> 60;
                case LOW_QUALITY -> 2;
                case SPOILED -> 0;
            };
        };
    }
}
