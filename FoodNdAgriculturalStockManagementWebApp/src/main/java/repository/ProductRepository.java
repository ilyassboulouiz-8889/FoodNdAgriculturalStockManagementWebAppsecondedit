package repository;

import model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Find all products belonging to a specific owner
    List<Product> findByOwnerId(int ownerId);
}
