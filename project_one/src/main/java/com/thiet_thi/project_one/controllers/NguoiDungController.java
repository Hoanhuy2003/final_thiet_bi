package com.thiet_thi.project_one.controllers;


import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.NguoiDungDto;
import com.thiet_thi.project_one.iservices.INguoiDungService;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ApiResponse<Page<NguoiDungResponse>> getAllNguoiDung(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<NguoiDungResponse>>builder()
                .result(nguoiDungService.getAllNguoiDung(pageable))
                .build();
    }
    @GetMapping("/myInfo")
    ApiResponse<NguoiDungResponse> getMyInfo() {
        return ApiResponse.<NguoiDungResponse>builder()
                .result(nguoiDungService.getMyInfo())
                .build();
    }
}
