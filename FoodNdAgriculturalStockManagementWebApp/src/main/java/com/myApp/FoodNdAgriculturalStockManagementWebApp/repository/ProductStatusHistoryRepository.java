package com.myApp.FoodNdAgriculturalStockManagementWebApp.repository;

import com.myApp.FoodNdAgriculturalStockManagementWebApp.model.ProductStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductStatusHistoryRepository extends JpaRepository<ProductStatusHistory, Integer> {

    @Query("""
        select h from ProductStatusHistory h
        join fetch h.product p
        where p.id = :productId
        order by h.changedAt asc
    """)
    List<ProductStatusHistory> findByProductIdWithProduct(int productId);
}
