package com.ndoan.cons.core.controller;

import com.ndoan.cons.core.dto.InputData;
import com.ndoan.cons.core.dto.OutputData;
import com.ndoan.cons.core.service.CalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class CalculatorController {
    @Autowired
    CalculatorService calculatorService;
    @PostMapping("/calculators/optimize")
    public ResponseEntity<OutputData> optimizeCut(@RequestBody InputData inputData) {
        return ResponseEntity.ok(calculatorService.optimizeCut(inputData)) ;
    }

}

