package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThietBiService;
import com.thiet_thi.project_one.models.ThietBi;
import com.thiet_thi.project_one.responses.ThietBiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/thiet_bi")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ThietBiController {

    private final IThietBiService thietBiService;

    @PostMapping("")
    public ResponseEntity<?> createThietBi(@RequestBody ThietBiDto dto) {
        try {
            ThietBi tb = thietBiService.createThietBi(dto);
            return ResponseEntity.ok(ThietBiResponse.fromThietBi(tb));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{maTB}")
    public ResponseEntity<?> getById(@PathVariable("maTB") String maTB) {
        try {
            ThietBiResponse detail = thietBiService.getById(maTB);
            return ResponseEntity.ok(detail);

        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    @PutMapping("/{maTB}")
    public ResponseEntity<?> updateThietBi(
            @PathVariable("maTB") String maTB,
            @Valid @RequestBody ThietBiDto dto) {
        try {
            ThietBi updated = thietBiService.updateThietBi(maTB, dto);
            return ResponseEntity.ok(ThietBiResponse.fromThietBi(updated));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Lỗi khi cập nhật thiết bị: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{maTB}")
    public ResponseEntity<?> deleteThietBi(@PathVariable("maTB") String maTB) {
        try {
            thietBiService.deleteThietBi(maTB);
            return ResponseEntity.ok("Xóa thiết bị " + maTB + " thành công!");
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Ví dụ: không xóa được nếu đang trong kiểm kê
        }
    }
    @GetMapping
    public ApiResponse<Page<ThietBiResponse>> getAllThietBi(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "maTB") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,

            // THAM SỐ LỌC TỪ FRONTEND
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String loai, // maLoai
            @RequestParam(required = false) String tinhTrang,
            @RequestParam(required = false) String phong) { // maPhong

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Gọi hàm Service mới để áp dụng lọc
        Page<ThietBiResponse> thietBiPage = thietBiService.searchAndFilter(
                search, loai, tinhTrang, phong, pageable
        );

        return ApiResponse.<Page<ThietBiResponse>>builder()
                .result(thietBiPage)
                .build();
    }

    @GetMapping("/list")
    public ApiResponse<List<ThietBiResponse>> getAllThietBiAsList() {
        List<ThietBiResponse> list = thietBiService.getAllAsList();

        return ApiResponse.<List<ThietBiResponse>>builder()
                .result(list)
                .build();
    }
}
