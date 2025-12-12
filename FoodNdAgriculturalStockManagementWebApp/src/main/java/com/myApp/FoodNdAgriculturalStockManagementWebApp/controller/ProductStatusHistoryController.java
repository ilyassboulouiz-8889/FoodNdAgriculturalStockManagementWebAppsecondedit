package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.dto.ProductStatusHistoryResponseDTO;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.ProductStatusHistory;
import com.myApp.FoodNdAgriculturalStockManagementWebApp.repository.ProductStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
public class ProductStatusHistoryController {

    @Autowired
    private ProductStatusHistoryRepository historyRepo;

    @GetMapping("/product/{id}")
    public List<ProductStatusHistoryResponseDTO> getByProduct(@PathVariable int id) {

        List<ProductStatusHistory> history = historyRepo.findByProductIdWithProduct(id);

        return history.stream()
                .map(h -> new ProductStatusHistoryResponseDTO(
                        h.getId(),
                        h.getNewStatus(),
                        h.getChangedAt(),
                        // ✅ take image from the product
                        (h.getProduct() != null) ? h.getProduct().getImageUrl() : null
                ))
                .toList();
    }
}
