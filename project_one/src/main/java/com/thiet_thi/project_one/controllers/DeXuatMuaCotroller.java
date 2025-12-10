package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IDeXuatMuaService;
import com.thiet_thi.project_one.responses.DeXuatMuaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/de_xuat_mua")
@RequiredArgsConstructor
public class DeXuatMuaCotroller {
    private final IDeXuatMuaService deXuatMuaService;

    // POST: Tạo đề xuất (ĐÚNG)
    @PostMapping
    public ResponseEntity<DeXuatMuaResponse> create(@Valid @RequestBody DeXuatMuaDto dto)
            throws DataNotFoundException {
        // Hàm create trong service trả về DTO/Response, không phải Entity
        DeXuatMuaResponse response = deXuatMuaService.create(dto);
        return ResponseEntity.ok(response);
    }

    // GET: Lấy tất cả (ĐÚNG)

    @GetMapping("/list")
    public ResponseEntity<List<DeXuatMuaResponse>> getAll() {
        return ResponseEntity.ok(deXuatMuaService.getAll());
    }

    // GET: Lấy theo mã
    @GetMapping("/{ma}")
    public ResponseEntity<DeXuatMuaResponse> getByMa(@PathVariable String ma)
            throws DataNotFoundException {
        // Cần gọi đúng tên hàm trong Service: getById
        return ResponseEntity.ok(deXuatMuaService.getById(ma));
    }

    // PATCH: Duyệt đề xuất
    @PatchMapping("/{ma}/duyet")
    public ResponseEntity<DeXuatMuaResponse> duyet(
            @PathVariable String ma,
            @RequestParam String maNguoiDuyet) throws DataNotFoundException {
        DeXuatMuaResponse response = deXuatMuaService.approve(ma, maNguoiDuyet);
        return ResponseEntity.ok(response);
    }
    // PATCH: Duyệt đề xuất
    @PatchMapping("/{ma}/tu_choi")
    public ResponseEntity<DeXuatMuaResponse> tuChoi(
            @PathVariable String ma,
            @RequestParam String maNguoiDuyet) throws DataNotFoundException {
        DeXuatMuaResponse response = deXuatMuaService.reject(ma, maNguoiDuyet);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ApiResponse<Page<DeXuatMuaResponse>> getAllDeXuat(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ngayTao") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,

            // Tham số lọc từ Frontend (ProcurementFilters.jsx)
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String nguoiTao) { // maNguoiTao

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<DeXuatMuaResponse> deXuatPage;

        // Nếu có tham số lọc, dùng hàm searchAndFilter
        if (search != null || trangThai != null || nguoiTao != null) {
            deXuatPage = deXuatMuaService.searchAndFilter(
                    search, trangThai, nguoiTao, pageable
            );
        } else {
            // Nếu không có tham số lọc, dùng hàm getAll cơ bản
            deXuatPage = deXuatMuaService.getAllPage(pageable);
        }
        return ApiResponse.<Page<DeXuatMuaResponse>>builder()
                .result(deXuatPage)
                .build();
    }

}