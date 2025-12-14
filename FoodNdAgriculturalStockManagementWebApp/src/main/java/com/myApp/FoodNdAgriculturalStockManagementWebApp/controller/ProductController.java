package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductStatusHistoryResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.UserRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.service.ProductService;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository; // <-- Inject repository

    @PostMapping("/add")
    public ProductResponseDTO addProduct(@RequestBody ProductRequestDTO request,
                                         Principal principal) {

        User owner = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Product p = new Product();

        p.setOwner(owner);
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setCategory(request.getCategory());
        p.setHarvestDate(request.getHarvestDate());
        p.setStorageTemperature(request.getStorageTemperature());
        p.setStorageHumidity(request.getStorageHumidity());
        p.setStatus(request.getStatus());
        p.setImageUrl(request.getImageUrl());
        Product saved = productService.addProduct(p, request);
        return convertToDTO(saved);
    }

    @PutMapping("/{id}/status")
    public ProductResponseDTO changeStatus(@PathVariable int id,
                                           @RequestParam CurrentStatus newStatus,
                                           Principal principal) {

        // 1) load product
        Product product = productService.getById(id);

        // 2) check ownership (only owner can change)
        String currentUserEmail = principal.getName();
        String ownerEmail = product.getOwner().getEmail();

        if (!currentUserEmail.equals(ownerEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only change status of your own products"
            );
        }

        // 3) update status + history
        Product updated = productService.updateStatus(id, newStatus);

        // 4) return DTO
        return convertToDTO(updated);
    }
    @GetMapping("/my")
    public List<ProductResponseDTO> getMyProducts(Principal principal,
                                                  @RequestParam(required = false) CurrentStatus status,
                                                  @RequestParam(required = false) String category,
                                                  @RequestParam(required = false)
                                                  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                      LocalDateTime fromHarvestDate,
                                                  @RequestParam(required = false)
                                                  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                  LocalDateTime toHarvestDate,
                                                  @RequestParam(required = false) String name) {

        String email = principal.getName();

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return productService.searchProducts(
                        owner.getId(),       // always filter by current owner
                        status,
                        category,
                        fromHarvestDate,
                        toHarvestDate,
                        name
                ).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }
    @GetMapping("/owner/{ownerId}")
    public List<ProductResponseDTO> getByOwner(@PathVariable int ownerId, Principal principal) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (!principal.getName().equals(owner.getEmail())
                && !hasAdminRole(principal)) {
            throw new RuntimeException("Access denied");
        }

        return productService.getProductsByOwner(ownerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private boolean hasAdminRole(Principal principal) {
        // implement role check using UserDetails
        return false; // placeholder
    }


    @GetMapping("/{id}")
    public ProductResponseDTO get(@PathVariable int id) {
        Product p = productService.getById(id);
        return convertToDTO(p);
    }

    @GetMapping
    public List<ProductResponseDTO> getAll() {
        return productService.getAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // --- Helper method already in your class ---
    private ProductResponseDTO convertToDTO(Product p) {
        List<ProductStatusHistoryResponseDTO> historyDTO = null;

        if (p.getHistory() != null) {
            historyDTO = p.getHistory().stream()
                    .map(h -> new ProductStatusHistoryResponseDTO(
                            h.getId(),
                            h.getNewStatus(),
                            h.getChangedAt(),
                            h.getProduct().getImageUrl() // ✅ ALWAYS CURRENT PRODUCT IMAGE
                    ))
                    .toList();
        }
        String ownerFullname = (p.getOwner() != null) ? p.getOwner().getFullname() : null;
        String ownerEmail = (p.getOwner() != null) ? p.getOwner().getEmail() : null;


        return new ProductResponseDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getCategory(),          // if category is String in Product
                p.getHarvestDate(),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getStorageTemperature(),
                p.getStorageHumidity(),
                p.getStatus(),
                historyDTO,
                p.getImageUrl(),
                p.getShelfLifeDays(),
                p.getExpiresAt(),
                p.isDeleted(),
                ownerFullname,
                ownerEmail


        );
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProduct(@PathVariable int id, Principal principal) {
        String email = principal.getName(); // from JWT
        productService.softDelete(id, email);
    }
    @PutMapping("/{id}/restore")
    public ProductResponseDTO restoreProduct(@PathVariable int id, Principal principal) {

        String email = principal.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only ADMIN can restore products"
            );
        }

        Product restored = productService.restore(id);
        return convertToDTO(restored);
    }
// ProductController.java (inside the class)

    @PutMapping("/{id}")
    public ProductResponseDTO updateProduct(@PathVariable int id,
                                            @RequestBody ProductRequestDTO request,
                                            Principal principal) {
        String email = principal.getName();

        Product updated = productService.updateProduct(id, request, email);

        return convertToDTO(updated);
    }



}
