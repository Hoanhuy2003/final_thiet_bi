package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.LoTBStatDto;
import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.iservices.ILoThietBiService;
import com.thiet_thi.project_one.models.LoThietBi;
import com.thiet_thi.project_one.dtos.ApiResponse; // 👇 Dùng class này để gói dữ liệu
import com.thiet_thi.project_one.repositorys.LoThietBiRepository;
import com.thiet_thi.project_one.responses.LoThietBiResponse;
import com.thiet_thi.project_one.services.ExcelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lo_thiet_bi")
@RequiredArgsConstructor
@CrossOrigin("*") // Cho phép Frontend gọi API
public class LoThietBiController {


    private final ILoThietBiService loThietBiService;
    private final LoThietBiRepository loThietBiRepository;
    private final ExcelService excelService;

    // 1. Nhập lô thủ công
    @PostMapping
    public ApiResponse<LoThietBiResponse> create(@Valid @RequestBody LoThietBiDto dto) {
        // Không cần try-catch, lỗi sẽ tự bay về GlobalExceptionHandler
        LoThietBi lo = loThietBiService.create(dto);

        // Trả về dạng chuẩn ApiResponse
        return ApiResponse.<LoThietBiResponse>builder()
                .result(LoThietBiResponse.from(lo))
                .build();
    }

    // 2. Lấy tất cả lô
    @GetMapping
    public ApiResponse<List<LoThietBiResponse>> getAll() {
        List<LoThietBiResponse> list = loThietBiService.getAll().stream()
                .map(LoThietBiResponse::from)
                .toList();

        return ApiResponse.<List<LoThietBiResponse>>builder()
                .result(list)
                .build();
    }

    // 3. Lấy 1 lô
    @GetMapping("/{ma}")
    public ApiResponse<LoThietBiResponse> getByMa(@PathVariable String ma) {
        return ApiResponse.<LoThietBiResponse>builder()
                .result(LoThietBiResponse.from(loThietBiService.getByMa(ma)))
                .build();
    }

    // 4. Nhập kho tự động từ đề xuất
    @PostMapping("/nhap-kho/{maDeXuat}")
    public ApiResponse<List<LoThietBiResponse>> nhapKhoTuDeXuat(@PathVariable String maDeXuat) {
        List<LoThietBiResponse> list = loThietBiService.nhapKhoTuDeXuat(maDeXuat).stream()
                .map(LoThietBiResponse::from)
                .toList();

        return ApiResponse.<List<LoThietBiResponse>>builder()
                .result(list)
                .build();
    }

    // 5. Thống kê (Nên chuyển logic này vào Service)
    @GetMapping("/stats")
    public ApiResponse<LoTBStatDto> getStats() {

        return ApiResponse.<LoTBStatDto>builder()
                 .result(loThietBiService.getStatistics())
                .build();
    }
    @GetMapping("/export")
    public ApiResponse<byte[]> exportExcel() {
        try {

            List<LoThietBi> listData = loThietBiRepository.findAll();
            byte[] excelBytes = excelService.exportLoThietBiToExcel(listData);

            return ApiResponse.<byte[]>builder()
                    .result(excelBytes)
                    .build(); // Hoặc hàm ApiResponse.success(excelBytes) tùy code bạn

        } catch (Exception e) {
            e.printStackTrace();
            // Tùy cách bạn handle lỗi trong ApiResponse
            throw new RuntimeException("Lỗi xuất file Excel");
        }
    }

}