package service;

import model.CurrentStatus;
import model.Product;
import model.ProductStatusHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.ProductRepository;
import repository.ProductStatusHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStatusHistoryRepository historyRepository;

    public Product addProduct(Product p) {
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(p);
    }

    public Product updateStatus(int productId, CurrentStatus newStatus) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(newStatus);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);

        ProductStatusHistory h = new ProductStatusHistory();
        h.setProduct(product);
        h.setNewStatus(newStatus);
        h.setChangedAt(LocalDateTime.now());
        historyRepository.save(h);

        return product;
    }

    public List<Product> getProductsByOwner(int ownerId) {
        return productRepository.findByOwnerId(ownerId);
    }

    public Product getById(int id) {
        return productRepository.findById(id).orElse(null);
    }
}
