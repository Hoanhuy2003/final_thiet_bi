package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThietBiService;
import com.thiet_thi.project_one.models.ThietBi;
import com.thiet_thi.project_one.responses.ThietBiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("")
    public ResponseEntity<List<ThietBiResponse>> getAll(){
        List<ThietBiResponse> responses = thietBiService.getAll()
                .stream()
                .map(ThietBiResponse::fromThietBi)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
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

}
