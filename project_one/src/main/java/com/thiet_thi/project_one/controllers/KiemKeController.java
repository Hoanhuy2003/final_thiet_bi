package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.iservices.IKiemKeService;
import com.thiet_thi.project_one.repositorys.KiemKeRepository;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import com.thiet_thi.project_one.models.KiemKe;
import com.thiet_thi.project_one.services.ExcelService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/kiem-ke")
@RequiredArgsConstructor
public class KiemKeController {

    private final IKiemKeService kiemKeService;
    private final ExcelService excelService;
    private final KiemKeRepository kiemKeRepository;

//    @GetMapping
//    public ResponseEntity<Page<KiemKeResponse>> getAllKiemKeSessions(Pageable pageable) {
//        try {
//            Page<KiemKeResponse> sessions = kiemKeService.getAllKiemKeSessions(pageable);
//            return ResponseEntity.ok(sessions);
//        } catch (Exception e) {
//            // Trả về 500 nếu lỗi server khi lấy danh sách
//            return ResponseEntity.internalServerError().body(null);
//        }
//    }

    @PostMapping("/session")
    public ResponseEntity<?> createSession(@RequestBody KiemKeDto dto) {
        try {
            // Thêm dòng này để debug trên Console của IntelliJ
            System.out.println("Payload nhận được: " + dto);

            KiemKe kiemKe = kiemKeService.createNewSession(dto);
            return ResponseEntity.ok(kiemKe);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra log server
            return ResponseEntity.badRequest().body("Lỗi Server: " + e.getMessage());
        }
    }
    @PostMapping("/submit")
    public ResponseEntity<String> submitChecklist(@RequestBody KiemKeDto dto) {
        try {
            kiemKeService.submitChecklist(dto);
            return ResponseEntity.ok("Hoàn thành kiểm kê và cập nhật tài sản thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi submit checklist: " + e.getMessage());
        }
    }

    @GetMapping("/{maKiemKe}")
    public ResponseEntity<KiemKeResponse> getKiemKeReport(@PathVariable String maKiemKe) {
        try {
            KiemKe kiemKeEntity = kiemKeService.getReportById(maKiemKe);
            KiemKeResponse response = KiemKeResponse.fromKiemKe(kiemKeEntity);

            // Trả về 200 OK và DTO báo cáo
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Trả về 404 Not Found với thông báo lỗi
            return ResponseEntity.status(404).body(null);
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllKiemKeSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            // Các tham số lọc
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String maPhong,
            @RequestParam(required = false) String trangThai
    ) {
        // Sắp xếp ngày mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayKiemKe").descending());

        // Gọi hàm service có lọc (đã viết ở bước trước)
        Page<KiemKeResponse> result = kiemKeService.filterKiemKeSessions(keyword, maPhong, trangThai, pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/export")
    public ApiResponse<byte[]> exportExcel() {
        try {
            // 1. Lấy danh sách Entity từ DB
            List<KiemKe> listEntities = kiemKeRepository.findAll();

            // 2. CHUYỂN ĐỔI ENTITY -> RESPONSE
            // (Để áp dụng các logic tính toán trong fromKiemKe)
            List<KiemKeResponse> listResponses = listEntities.stream()
                    .map(KiemKeResponse::fromKiemKe) // Gọi hàm static map bạn đã viết
                    .toList();

            // 3. Đưa List Response vào hàm Excel đã sửa
            byte[] excelBytes = excelService.exportKiemKeToExcel(listResponses);

            return ApiResponse.<byte[]>builder()
                    .result(excelBytes)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi xuất Excel: " + e.getMessage());
        }
    }

    @GetMapping("/{ma}/export-bien-ban")

    public ApiResponse<byte[]> exportBienBan(@PathVariable String ma) {
        try {
            // 1. Lấy chi tiết phiếu từ DB
            KiemKe kk = kiemKeService.getById(ma);

            // 2. Chuyển sang Response (để có số liệu thống kê Tồn/Mất/Hỏng)
            KiemKeResponse responseData = KiemKeResponse.fromKiemKe(kk);

            // 3. Vẽ Excel Chi tiết (Hàm này bạn đã viết trong ExcelService ở bước trước)
            byte[] excelBytes = excelService.exportBienBanKiemKe(responseData);

            // 4. Trả về ApiResponse (để Frontend nhận được .result)
            return ApiResponse.<byte[]>builder()
                    .result(excelBytes)
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi xuất biên bản: " + e.getMessage());
        }
    }
}