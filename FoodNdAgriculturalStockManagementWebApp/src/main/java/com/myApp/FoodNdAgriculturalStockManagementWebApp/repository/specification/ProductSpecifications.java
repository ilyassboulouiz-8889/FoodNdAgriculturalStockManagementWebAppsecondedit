package com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.specification;// package com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.specification;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Product;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {

    public static Specification<Product> ownedBy(int ownerId) {
        return (root, query, cb) ->
                cb.equal(root.get("owner").get("id"), ownerId);
    }

    public static Specification<Product> nameContainsIgnoreCase(String name) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> hasStatus(CurrentStatus status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) ->
                cb.equal(root.get("category"), category);
    }

    public static Specification<Product> harvestAfter(java.time.LocalDateTime from) {
        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("harvestDate"), from);
    }

    public static Specification<Product> harvestBefore(java.time.LocalDateTime to) {
        return (root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("harvestDate"), to);
    }

    // ✅ for soft delete
    public static Specification<Product> notDeleted() {
        return (root, query, cb) ->
                cb.isFalse(root.get("deleted"));
    }

    public static Specification<Product> onlyDeleted() {
        return (root, query, cb) ->
                cb.isTrue(root.get("deleted"));
    }

    // 🔍 for admin filter on ownerEmail (ignore case)
    public static Specification<Product> ownerEmailEqualsIgnoreCase(String email) {
        String trimmed = email.trim().toLowerCase();
        return (root, query, cb) ->
                cb.equal(cb.lower(root.get("owner").get("email")), trimmed);
    }
}
