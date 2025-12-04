package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.VaiTroDto;
import com.thiet_thi.project_one.iservices.IVaiTroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class VaiTroController {

    private final IVaiTroService service;

    @GetMapping
    public ApiResponse<List<VaiTroDto>> getAllRoles() {
        return ApiResponse.<List<VaiTroDto>>builder()
                .result(service.getAllRoles())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<VaiTroDto> getRoleById(@PathVariable String id) {
        return ApiResponse.<VaiTroDto>builder()
                .result(service.getRoleByMaVaiTro(id))
                .build();
    }

    @PostMapping
    public ApiResponse<VaiTroDto> createRole(@RequestBody VaiTroDto dto) {
        return ApiResponse.<VaiTroDto>builder()
                .result(service.createRole(dto))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<VaiTroDto> updateRole(@PathVariable String id, @RequestBody VaiTroDto dto) {
        return ApiResponse.<VaiTroDto>builder()
                .result(service.updateRole(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable String id) {
        service.deleteRole(id);
        return ApiResponse.<Void>builder()
                .result(null)
                .build();
    }
}
