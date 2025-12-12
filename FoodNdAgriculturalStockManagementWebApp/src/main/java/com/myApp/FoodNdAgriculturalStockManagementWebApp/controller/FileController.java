package com.myApp.FoodNdAgriculturalStockManagementWebApp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FileController {

    private final Path uploadDir = Paths.get("uploads");

    public FileController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload dir", e);
        }
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file uploaded");
        }

        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int dot = originalName.lastIndexOf('.');
            if (dot != -1) {
                ext = originalName.substring(dot);
            }

            String storedName = UUID.randomUUID() + ext;
            Path target = uploadDir.resolve(storedName);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return Map.of("url", "/uploads/" + storedName);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File save failed", e);
        }
    }
}
