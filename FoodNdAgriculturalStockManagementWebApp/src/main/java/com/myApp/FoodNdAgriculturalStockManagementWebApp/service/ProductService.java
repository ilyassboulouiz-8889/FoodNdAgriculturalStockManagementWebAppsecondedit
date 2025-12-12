package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductRequestDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.CurrentStatus;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Product;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.ProductStatusHistory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.ProductRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.ProductStatusHistoryRepository;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.specification.ProductSpecifications;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.List;

import static com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.specification.ProductSpecifications.*;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStatusHistoryRepository historyRepository;

    public ProductService(ProductRepository productRepository,
                          ProductStatusHistoryRepository historyRepository) {
        this.productRepository = productRepository;
        this.historyRepository = historyRepository;
    }

    public Product addProduct(Product p) {
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(p);
    }
    public List<Product> searchProducts(int ownerId,
                                        CurrentStatus status,
                                        String category,
                                        LocalDateTime from,
                                        LocalDateTime to,
                                        String name) {

        Specification<Product> spec =
                ProductSpecifications.ownedBy(ownerId)
                        .and(notDeleted());  // 👈 important

        if (name != null)
            spec = spec.and(ProductSpecifications.nameContainsIgnoreCase(name));

        if (status != null)
            spec = spec.and(hasStatus(status));

        if (category != null)
            spec = spec.and(ProductSpecifications.hasCategory(category));

        if (from != null)
            spec = spec.and(ProductSpecifications.harvestAfter(from));

        if (to != null)
            spec = spec.and(ProductSpecifications.harvestBefore(to));

        return productRepository.findAll(spec);
    }


    @Transactional
    public Product updateStatus(int id, CurrentStatus newStatus) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // update product
        product.setStatus(newStatus);
        product.setUpdatedAt(LocalDateTime.now());

        // create history record
        ProductStatusHistory history = new ProductStatusHistory();
        history.setProduct(product);
        history.setNewStatus(newStatus);
        history.setChangedAt(LocalDateTime.now());

        historyRepository.save(history);

        // keep in-memory list in sync
        if (product.getHistory() == null) {
            product.setHistory(new java.util.ArrayList<>());
        }
        product.getHistory().add(history);

        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll(
                notDeleted()
        );
    }

    public List<Product> getProductsByOwner(int ownerId) {
        Specification<Product> spec =
                ProductSpecifications.ownedBy(ownerId)
                        .and(notDeleted());

        return productRepository.findAll(spec);
    }



    // --- soft delete method ---
    @Transactional
    public void softDelete(int id, String requesterEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Optional: same ownership check as changeStatus
        String ownerEmail = product.getOwner().getEmail();
        if (!requesterEmail.equals(ownerEmail)) {
            throw new RuntimeException("You can only delete your own products");
        }

        if (!product.isDeleted()) {
            product.setDeleted(true);
            product.setUpdatedAt(LocalDateTime.now());
            productRepository.save(product);
        }
    }
    public Product getById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    public List<Product> getAllIncludingDeleted() {
        // no spec => no "deleted = false" filter
        return productRepository.findAll();
    }
    @Transactional
    public Product restore(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // if it's already restored, just return it
        if (!product.isDeleted()) {
            return product;
        }

        product.setDeleted(false);
        product.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }
    public List<Product> adminSearchProducts(
            String ownerEmail,
            CurrentStatus status,
            String deletedFilter
    ) {
        // start with "true"
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        // filter by owner email (ignore case)
        if (ownerEmail != null && !ownerEmail.isBlank()) {
            spec = spec.and(ProductSpecifications.ownerEmailEqualsIgnoreCase(ownerEmail));
        }

        // filter by status
        if (status != null) {
            spec = spec.and(ProductSpecifications.hasStatus(status));
        }

        // filter by deleted flag
        if (deletedFilter == null || deletedFilter.isBlank() ||
                deletedFilter.equalsIgnoreCase("ALL")) {
            // show all, nothing to add
        } else if (deletedFilter.equalsIgnoreCase("ONLY_ACTIVE")) {
            spec = spec.and(ProductSpecifications.notDeleted());
        } else if (deletedFilter.equalsIgnoreCase("ONLY_DELETED")) {
            spec = spec.and(ProductSpecifications.onlyDeleted());
        }

        return productRepository.findAll(spec);
    }
    @Transactional
    public Product updateProduct(int id, ProductRequestDTO dto, String requesterEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with id: " + id
                ));

        // Only owner can modify (same logic style as status change)
        String ownerEmail = product.getOwner().getEmail();
        if (!requesterEmail.equals(ownerEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own products"
            );
        }

        // Update fields from DTO
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setHarvestDate(dto.getHarvestDate());
        product.setStorageTemperature(dto.getStorageTemperature());
        product.setStorageHumidity(dto.getStorageHumidity());
        product.setStatus(dto.getStatus());
        product.setUpdatedAt(LocalDateTime.now());
        product.setImageUrl(dto.getImageUrl());
        return productRepository.save(product);
    }

}
