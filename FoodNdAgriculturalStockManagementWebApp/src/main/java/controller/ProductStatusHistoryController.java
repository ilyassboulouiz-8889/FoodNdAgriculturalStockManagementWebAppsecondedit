package controller;

import model.ProductStatusHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import repository.ProductStatusHistoryRepository;

import java.util.List;

@RestController
@RequestMapping("/history")
public class ProductStatusHistoryController {

    @Autowired
    private ProductStatusHistoryRepository historyRepo;

    @GetMapping("/product/{id}")
    public List<ProductStatusHistory> getByProduct(@PathVariable int id) {
        return historyRepo.findByProductId(id);
    }
}
