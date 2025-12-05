package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.DonViDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IDonViService;
import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.responses.DonViResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/don-vi")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DonViController {

    private final IDonViService donViService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DonViDto dto) {
        try {
            DonVi donVi = donViService.createDonVi(dto);
            return ResponseEntity.ok(DonViResponse.from(donVi));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{ma}")
    public ResponseEntity<?> update(@PathVariable String ma, @Valid @RequestBody DonViDto dto) {
        try {
            DonVi donVi = donViService.updateDonVi(ma, dto);
            return ResponseEntity.ok(DonViResponse.from(donVi));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{ma}")
    public ResponseEntity<String> delete(@PathVariable String ma) {
        try {
            donViService.deleteDonVi(ma);
            return ResponseEntity.ok("Xóa đơn vị thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DonViResponse>> getAll() {
        return ResponseEntity.ok(
                donViService.getAllDonVi().stream()
                        .map(DonViResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{ma}")
    public ResponseEntity<?> getByMa(@PathVariable String ma) {
        try {
            DonVi donVi = donViService.getByMaDV(ma);
            return ResponseEntity.ok(DonViResponse.from(donVi));
        } catch (DataNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}