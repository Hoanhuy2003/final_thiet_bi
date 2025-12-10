package com.thiet_thi.project_one.controllers;


import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.NguoiDungDto;
import com.thiet_thi.project_one.iservices.INguoiDungService;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nguoi_dung")
@RequiredArgsConstructor
public class NguoiDungController {

    private final INguoiDungService nguoiDungService;

    @PostMapping

    public ApiResponse<NguoiDungResponse> createNguoiDung(@RequestBody NguoiDungDto dto) {

        return ApiResponse.<NguoiDungResponse>builder()
                .result(nguoiDungService.createNguoiDung(dto))
                .build();
    }


    @PutMapping("/{maNguoiDung}")
    public ApiResponse<NguoiDungResponse> updateNguoiDung(@PathVariable String maNguoiDung, @RequestBody NguoiDungDto dto) {
        return ApiResponse.<NguoiDungResponse>builder()
                .result(nguoiDungService.updateNguoiDung(maNguoiDung, dto))
                .build();
    }

    @DeleteMapping("/{maNguoiDung}")
    public ApiResponse<Void> deleteNguoiDung(@PathVariable String maNguoiDung) {
        nguoiDungService.deleteNguoiDung(maNguoiDung);
        return ApiResponse.<Void>builder()
                .build();
    }


    @GetMapping("/{maNguoiDung}")
    public ApiResponse<NguoiDungResponse> getNguoiDungById(@PathVariable String maNguoiDung) {
        return ApiResponse.<NguoiDungResponse>builder()
                .result(nguoiDungService.getNguoiDungById(maNguoiDung))
                .build();
    }

    @GetMapping("/list")
    public ApiResponse<List<NguoiDungResponse>> getAllAsList() {
        return ApiResponse.<List<NguoiDungResponse>>builder()
                .result(nguoiDungService.getAllAsList())
                .build();
    }
    @GetMapping("/myInfo")
    ApiResponse<NguoiDungResponse> getMyInfo() {
        return ApiResponse.<NguoiDungResponse>builder()
                .result(nguoiDungService.getMyInfo())
                .build();
    }
    @GetMapping
    public ApiResponse<Page<NguoiDungResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "tenND") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,

            // Tham số lọc
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String vaiTro,
            @RequestParam(required = false) String donVi,
            @RequestParam(required = false) String trangThai
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection),sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NguoiDungResponse> resultPage;

        resultPage = nguoiDungService.searchAndFilter(search, vaiTro, donVi, trangThai, pageable);

        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .result(resultPage)
                .build();
    }
}
