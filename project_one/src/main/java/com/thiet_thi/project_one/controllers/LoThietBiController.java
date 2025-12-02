package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.ILoThietBiService;
import com.thiet_thi.project_one.models.LoThietBi;
import com.thiet_thi.project_one.responses.LoThietBiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// src/main/java/com/thiet_thi/project_one/controllers/LoThietBiController.java
@RestController
@RequestMapping("/api/lo_thiet_bi")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LoThietBiController {

    private final ILoThietBiService loThietBiService;

    // 1. Nhập lô thủ công
    @PostMapping
    public ResponseEntity<LoThietBiResponse> create(@Valid @RequestBody LoThietBiDto dto)
            throws DataNotFoundException {
        LoThietBi lo = loThietBiService.create(dto);
        return ResponseEntity.ok(LoThietBiResponse.from(lo));
    }

    // 2. Lấy tất cả lô
    @GetMapping
    public ResponseEntity<List<LoThietBiResponse>> getAll() {
        return ResponseEntity.ok(
                loThietBiService.getAll().stream()
                        .map(LoThietBiResponse::from)
                        .toList()
        );
    }

    // 3. Lấy 1 lô
    @GetMapping("/{ma}")
    public ResponseEntity<LoThietBiResponse> getByMa(@PathVariable String ma) throws DataNotFoundException {
        return ResponseEntity.ok(LoThietBiResponse.from(loThietBiService.getByMa(ma)));
    }

    // 4. BONUS: Nhập kho tự động từ đề xuất đã duyệt (thầy cô mê lắm!)
    @PostMapping("/nhap-kho/{maDeXuat}")
    public ResponseEntity<List<LoThietBiResponse>> nhapKhoTuDeXuat(@PathVariable String maDeXuat)
            throws DataNotFoundException {
        return ResponseEntity.ok(
                loThietBiService.nhapKhoTuDeXuat(maDeXuat).stream()
                        .map(LoThietBiResponse::from)
                        .toList()
        );
    }
}
