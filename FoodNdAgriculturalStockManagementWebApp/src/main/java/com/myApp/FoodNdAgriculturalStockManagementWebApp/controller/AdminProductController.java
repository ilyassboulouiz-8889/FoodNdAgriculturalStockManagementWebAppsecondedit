package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductStatusHistoryResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Product;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Role;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.User;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    // 🔐 ADMIN: list products (with optional filters + deleted)
    @GetMapping("/products")
    public List<ProductResponseDTO> getAllProductsAdmin(
            Principal principal,
            @RequestParam(required = false) String ownerEmail,
            @RequestParam(required = false) CurrentStatus status,
            @RequestParam(defaultValue = "ALL") String deletedFilter   // ALL | ONLY_ACTIVE | ONLY_DELETED
    ) {
        String email = principal.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found with email: " + email
                ));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ADMIN can access this endpoint"
            );
        }

        List<Product> products =
                productService.adminSearchProducts(ownerEmail, status, deletedFilter);

        return products.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // 🔐 ADMIN: restore a soft-deleted product
    @PutMapping("/products/{id}/restore")
    public ProductResponseDTO restoreProduct(@PathVariable int id, Principal principal) {

        String email = principal.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found with email: " + email
                ));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ADMIN can restore products"
            );
        }

        Product restored = productService.restore(id);
        return convertToDTO(restored);
    }

    // --- Helper mapping (same style as ProductController) ---
    private ProductResponseDTO convertToDTO(Product p) {
        var historyDTO = (p.getHistory() == null) ? null :
                p.getHistory().stream()
                        .map(h -> new ProductStatusHistoryResponseDTO(
                                h.getId(),
                                h.getNewStatus(),
                                h.getChangedAt(),
                                p.getImageUrl()
                        ))
                        .toList();

        return new ProductResponseDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getCategory(),
                p.getHarvestDate(),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getStorageTemperature(),
                p.getStorageHumidity(),
                p.getStatus(),
                historyDTO,
                p.getImageUrl()
        );
    }
}
