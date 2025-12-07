package repository;

import model.ProductStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductStatusHistoryRepository extends JpaRepository<ProductStatusHistory, Integer> {

    // Find all status history for a given product
    List<ProductStatusHistory> findByProductId(int productId);
}
