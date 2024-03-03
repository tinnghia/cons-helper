package com.ndoan.cons.core.controller;

import com.ndoan.cons.core.dto.InputData;
import com.ndoan.cons.core.dto.OutputData;
import com.ndoan.cons.core.service.CalculatorService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = {"Content-Disposition"})
@RequestMapping("/api")
public class CalculatorController {
    @Autowired
    CalculatorService calculatorService;

    @PostMapping("/calculators/optimize")
    public ResponseEntity<OutputData> optimizeCut(@RequestBody InputData inputData) {
        return ResponseEntity.ok(calculatorService.optimizeBars(inputData));
    }

    @Autowired
    private ServletContext servletContext;

    @GetMapping("/calculators/doc/{workId}")
    public ResponseEntity<InputStreamResource> generateWorkDoc(@PathVariable String workId) throws IOException {

        String userDocFile;
        String mineType;
        MediaType mediaType;
        try {
            userDocFile = calculatorService.generateWordDoc("nghia", workId);
            mineType = servletContext.getMimeType(userDocFile);
            mediaType = MediaType.parseMediaType(mineType);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        File file = new File(userDocFile);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(mediaType)
                .contentLength(file.length())
                .body(resource);
    }
}

