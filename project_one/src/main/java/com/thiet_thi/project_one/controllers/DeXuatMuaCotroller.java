package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IDeXuatMuaService;
import com.thiet_thi.project_one.models.DeXuatMua;
import com.thiet_thi.project_one.responses.DeXuatMuaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/de_xuat_mua")
@RequiredArgsConstructor
public class DeXuatMuaCotroller {
    private final IDeXuatMuaService deXuatMuaService;

    @PostMapping
    public ResponseEntity<DeXuatMuaResponse> create(@Valid @RequestBody DeXuatMuaDto dto)
            throws DataNotFoundException {
        DeXuatMua deXuat = deXuatMuaService.create(dto);
        return ResponseEntity.ok(DeXuatMuaResponse.from(deXuat));
    }

    @GetMapping
    public ResponseEntity<List<DeXuatMuaResponse>> getAll() {
        return ResponseEntity.ok(
                deXuatMuaService.getAll().stream()
                        .map(DeXuatMuaResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{ma}")
    public ResponseEntity<DeXuatMuaResponse> getByMa(@PathVariable String ma)
            throws DataNotFoundException {
        return ResponseEntity.ok(DeXuatMuaResponse.from(deXuatMuaService.getByMa(ma)));
    }

    @PatchMapping("/{ma}/duyet")
    public ResponseEntity<DeXuatMuaResponse> duyet(
            @PathVariable String ma,
            @RequestParam String maNguoiDuyet) throws DataNotFoundException {
        DeXuatMua deXuat = deXuatMuaService.duyetDeXuat(ma, maNguoiDuyet);
        return ResponseEntity.ok(DeXuatMuaResponse.from(deXuat));
    }

}
