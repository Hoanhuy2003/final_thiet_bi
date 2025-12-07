package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.iservices.INhaCungCapService;
import com.thiet_thi.project_one.responses.NhaCungCapResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/nha_cung_cap")
@RequiredArgsConstructor
public class NhaCungCapController {

    private final INhaCungCapService nhaCungCapService;

    @GetMapping
    public ResponseEntity<List<NhaCungCapResponse>> getAll() {
        return ResponseEntity.ok(nhaCungCapService.getAll());
    }
}