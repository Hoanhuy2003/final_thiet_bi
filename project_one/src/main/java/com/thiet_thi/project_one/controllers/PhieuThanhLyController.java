// src/main/java/com/thiet_thi/project_one/controllers/PhieuThanhLyController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.PhieuThanhLyDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThanhLyService;
import com.thiet_thi.project_one.models.PhieuThanhLy;
import com.thiet_thi.project_one.repositorys.PhieuThanhLyRepository;
import com.thiet_thi.project_one.responses.PhieuThanhLyResponse;
import com.thiet_thi.project_one.services.ExcelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/thanh_ly")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PhieuThanhLyController {

    private final IThanhLyService phieuThanhLyService;
    private final ExcelService excelService;
    private final PhieuThanhLyRepository phieuThanhLyRepository;

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

    @PatchMapping("/{ma}/duyet")
    public ResponseEntity<PhieuThanhLyResponse> duyetPhieu(
            @PathVariable String ma,
            @RequestParam String maNguoiDuyet) {
        try {
            PhieuThanhLy phieu = phieuThanhLyService.duyetPhieu(ma, maNguoiDuyet);
            return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PatchMapping("/{ma}/tuchoi")
    public ResponseEntity<PhieuThanhLyResponse> tuChoiPhieu(
            @PathVariable String ma,
            @RequestParam String maNguoiDuyet,
            @RequestParam(required = false, defaultValue = "Không đủ điều kiện") String lyDoTuChoi) {
        try {
            PhieuThanhLy phieu = phieuThanhLyService.tuChoiPhieu(ma, maNguoiDuyet, lyDoTuChoi);
            return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 2. Sửa phiếu (chỉ khi chưa duyệt)
    @PutMapping("/{ma}")
    public ResponseEntity<?> update(
            @PathVariable String ma,
            @Valid @RequestBody PhieuThanhLyDto dto) {
        try {
            PhieuThanhLy phieu = phieuThanhLyService.update(ma, dto);
            return ResponseEntity.ok(PhieuThanhLyResponse.from(phieu));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi sửa phiếu: " + e.getMessage());
        }
    }

    // 3. Xóa phiếu (chỉ khi chưa duyệt)
    @DeleteMapping("/{maPhieu}")
    public ResponseEntity<String> delete(@PathVariable String maPhieu) {
        try {
            phieuThanhLyService.delete(maPhieu);
            return ResponseEntity.ok("Xóa phiếu thanh lý thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi: " + e.getMessage());
        }
    }
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() {
        try {
            // 1. Lấy dữ liệu
            List<PhieuThanhLy> listData = phieuThanhLyRepository.findAll();

            byte[] excelBytes = excelService.exportThanhLyToExcel(listData);

            // 3. Trả về file
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=danh_sach_phieu_thanh_ly.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/{ma}/export-bien-ban")
    public ResponseEntity<byte[]> exportBienBan(@PathVariable String ma) {
        try {
            // 1. Lấy chi tiết phiếu
            PhieuThanhLy phieu = phieuThanhLyService.getByID(ma); // Hàm này bạn chắc đã có

            // 2. Vẽ Excel chi tiết (Biên bản)
            byte[] excelBytes = excelService.exportBienBanThanhLy(phieu);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bien_ban.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}