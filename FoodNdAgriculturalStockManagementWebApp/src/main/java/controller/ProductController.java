package controller;

import dto.ProductRequestDTO;
import dto.ProductResponseDTO;
import dto.ProductStatusHistoryResponseDTO;
import model.Product;
import model.ProductStatusHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import repository.UserRepository;
import service.ProductService;

import java.security.Principal;
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
    public ProductResponseDTO addProduct(@RequestBody ProductRequestDTO request) {
        Product p = new Product();
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setCategory(request.getCategory());
        p.setHarvestDate(request.getHarvestDate());
        p.setStorageTemperature(request.getStorageTemperature());
        p.setStorageHumidity(request.getStorageHumidity());
        p.setStatus(request.getStatus());

        Product saved = productService.addProduct(p);
        return convertToDTO(saved);
    }

    @PutMapping("/{id}/status")
    public ProductResponseDTO changeStatus(@PathVariable int id,
                                           @RequestParam ProductStatusHistory newStatus) {
        Product updated = productService.updateStatus(id, newStatus.getNewStatus());
        return convertToDTO(updated);
    }

    @GetMapping("/owner/{ownerId}")
    public List<ProductResponseDTO> getByOwner(@PathVariable int ownerId, Principal principal) {
        // Only allow access if current user matches ownerId or has ADMIN role
        if (!principal.getName().equals(userRepository.findById(ownerId).get().getEmail())
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

    // --- Helper method to convert Product to ProductResponseDTO ---
    private ProductResponseDTO convertToDTO(Product p) {
        List<ProductStatusHistoryResponseDTO> historyDTO = p.getHistory() != null ?
                p.getHistory().stream()
                        .map(h -> new ProductStatusHistoryResponseDTO(
                                h.getId(),
                                h.getNewStatus(),
                                h.getChangedAt()
                        )).collect(Collectors.toList()) : null;

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
                historyDTO
        );
    }
}
