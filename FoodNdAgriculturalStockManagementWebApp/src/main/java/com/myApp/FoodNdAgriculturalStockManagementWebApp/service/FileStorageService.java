package com.myApp.FoodNdAgriculturalStockManagementWebApp.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadRoot;

    public FileStorageService() throws IOException {
        this.uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
    }

    public String save(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.'))
                : "";

        String newFileName = UUID.randomUUID().toString() + ext;
        Path target = uploadRoot.resolve(newFileName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/uploads/" + newFileName;
    }
}
