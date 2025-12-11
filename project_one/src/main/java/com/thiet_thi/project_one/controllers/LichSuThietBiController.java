// src/main/java/com/thiet_thi/project_one/controllers/LichSuThietBiController.java
package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.iservices.ILichSuThietBiService;
import com.thiet_thi.project_one.responses.LichSuThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-su-thiet-bi")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LichSuThietBiController {  // ĐÃ SỬA: XÓA DÒNG SAI, ĐÚNG TÊN CLASS

    private final ILichSuThietBiService lichSuThietBiService;

    @GetMapping("/{maTB}")
    public ResponseEntity<List<LichSuThietBiResponse>> getLichSuByMaTB(@PathVariable String maTB) {
        List<LichSuThietBiResponse> lichSu = lichSuThietBiService.getLichSuByMaTB(maTB);
        return ResponseEntity.ok(lichSu);
    }
}