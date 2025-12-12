package com.myApp.FoodNdAgriculturalStockManagementWebApp.repository;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository
        extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    // you can remove findByOwnerId(...) now, we use Specification instead
}
