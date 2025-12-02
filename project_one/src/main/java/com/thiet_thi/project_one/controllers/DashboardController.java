// src/main/java/com/thiet_thi/project_one/controllers/DashboardController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.responses.DashboardResponse;
import com.thiet_thi.project_one.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * API CHÍNH CHO TOÀN BỘ DASHBOARD
     * Frontend chỉ cần gọi 1 lần: GET /api/dashboard
     * → Nhận toàn bộ dữ liệu thật: số liệu, biểu đồ, hoạt động gần đây
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData() {
        DashboardResponse data = dashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/refresh")
    public ResponseEntity<DashboardResponse> refresh() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}