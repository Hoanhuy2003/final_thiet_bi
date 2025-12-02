// src/main/java/com/thiet_thi/project_one/controllers/PhieuThanhLyController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.PhieuThanhLyDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThanhLyService;
import com.thiet_thi.project_one.models.PhieuThanhLy;
import com.thiet_thi.project_one.responses.PhieuThanhLyResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thanh_ly")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PhieuThanhLyController {

    private final IThanhLyService phieuThanhLyService;

    @PostMapping
    public ResponseEntity<PhieuThanhLyResponse> create(
            @Valid @RequestBody PhieuThanhLyDto dto) throws DataNotFoundException {
        PhieuThanhLy phieu = phieuThanhLyService.create(dto);
        return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
    }

    // 2. Lấy danh sách tất cả phiếu thanh lý (có chi tiết đầy đủ)
    @GetMapping
    public ResponseEntity<List<PhieuThanhLyResponse>> getAll() {
        List<PhieuThanhLyResponse> responses = phieuThanhLyService.getAll().stream()
                .map(PhieuThanhLyResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    // 3. Lấy 1 phiếu chi tiết theo mã
    @GetMapping("/{ma}")
    public ResponseEntity<PhieuThanhLyResponse> getByMa(
            @PathVariable String ma) throws DataNotFoundException {
        PhieuThanhLy phieu = phieuThanhLyService.getByID(ma);
        return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
    }

//    // 4. Duyệt phiếu thanh lý (bonus – cực kỳ chuyên nghiệp)
//    @PatchMapping("/{ma}/duyet")
//    public ResponseEntity<PhieuThanhLyResponse> duyetPhieu(
//            @PathVariable String ma,
//            @RequestParam String maNguoiDuyet) throws DataNotFoundException {
//        PhieuThanhLy phieu = phieuThanhLyService.duyetPhieu(ma, maNguoiDuyet);
//        return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
//    }
}