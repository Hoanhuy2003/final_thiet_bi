package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.iservices.IKiemKeService;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import com.thiet_thi.project_one.models.KiemKe;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/kiem-ke")
@RequiredArgsConstructor
public class KiemKeController {

    private final IKiemKeService kiemKeService;

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
}