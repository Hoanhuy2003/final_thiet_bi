// src/main/java/com/thiet_thi/project_one/controllers/BaoCaoController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.BaoCaoDto;
import com.thiet_thi.project_one.models.BaoCao;
import com.thiet_thi.project_one.responses.BaoCaoResponse;
import com.thiet_thi.project_one.iservices.IBaoCaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bao-cao")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BaoCaoController {

    private final IBaoCaoService baoCaoService;

    // Tạo báo cáo mới
    @PostMapping("/tao")
    public ResponseEntity<BaoCaoResponse> taoBaoCao(@Valid @RequestBody BaoCaoDto dto) {
        BaoCao baoCao = baoCaoService.taoBaoCao(dto);
        return ResponseEntity.ok(BaoCaoResponse.fromEntity(baoCao));
    }

    // Lấy danh sách tất cả báo cáo (hiển thị bảng lịch sử)
    @GetMapping
    public ResponseEntity<List<BaoCaoResponse>> getAll() {
        List<BaoCaoResponse> responses = baoCaoService.getAll().stream()
                .map(BaoCaoResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // (Tương lai) Tải file báo cáo
    // @GetMapping("/{id}/download")
    // public ResponseEntity<Resource> download(@PathVariable Long id) { ... }
}