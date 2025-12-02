// src/main/java/com/thiet_thi/project_one/controllers/KiemKeController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IKiemKeService;
import com.thiet_thi.project_one.models.KiemKe;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kiem_ke")
@RequiredArgsConstructor
@CrossOrigin("*")
public class KiemKeController {

    private final IKiemKeService kiemKeService;

    // GET: Danh sách phiếu kiểm kê (có thống kê đẹp)
    @GetMapping
    public ResponseEntity<List<KiemKeResponse>> getAll() {
        List<KiemKeResponse> responses = kiemKeService.getAll().stream()
                .map(KiemKeResponse::fromKiemKe)
                .toList();
        return ResponseEntity.ok(responses);
    }

    // GET: Chi tiết 1 phiếu
    @GetMapping("/{maKK}")
    public ResponseEntity<KiemKeResponse> getById(@PathVariable String maKK) throws DataNotFoundException {
        KiemKe kk = kiemKeService.getById(maKK);
        return ResponseEntity.ok(KiemKeResponse.fromKiemKe(kk));
    }

    // GET: Tất cả chi tiết kiểm kê (nếu cần)
    @GetMapping("/chi_tiet")
    public ResponseEntity<List<KiemKeResponse.ChiTietKiemKeResponse>> getAllChiTiet() {
        List<KiemKeResponse.ChiTietKiemKeResponse> response = kiemKeService.getAllChiTiet()
                .stream()
                .map(KiemKeResponse.ChiTietKiemKeResponse::fromChiTietKiemKe)
                .toList();
        return ResponseEntity.ok(response);

    }

    // POST: Tạo mới
    @PostMapping
    public ResponseEntity<KiemKeResponse> create(@RequestBody KiemKeDto dto) throws DataNotFoundException {
        KiemKe saved = kiemKeService.create(dto);
        return ResponseEntity.ok(KiemKeResponse.fromKiemKe(saved));
    }

    // PUT: Cập nhật
    @PutMapping("/{maKK}")
    public ResponseEntity<KiemKeResponse> update(
            @PathVariable String maKK,
            @RequestBody KiemKeDto dto) throws DataNotFoundException {
        KiemKe updated = kiemKeService.update(maKK, dto);
        return ResponseEntity.ok(KiemKeResponse.fromKiemKe(updated));
    }
}