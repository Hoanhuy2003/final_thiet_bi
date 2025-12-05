package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.dtos.PhongDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IPhongService;
import com.thiet_thi.project_one.models.Phong;
import com.thiet_thi.project_one.responses.PhongResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/phong")
@RequiredArgsConstructor
public class PhongController {
    private final IPhongService phongService;

    @GetMapping("")
    public ResponseEntity<List<PhongResponse>> getAllPhong(){
        List<PhongResponse> responses = phongService.getAllPhong().stream()
                .map(PhongResponse::fromPhong)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("")
    public ResponseEntity<?> createPhong(@RequestBody PhongDto phongHocDTO){
        try {
            Phong phongHoc = phongService.createPhong(phongHocDTO);
            return ResponseEntity.ok(PhongResponse.fromPhong(phongHoc));
        }catch (DataNotFoundException e) {
            return  ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @GetMapping("/{maPhong}")
    public ResponseEntity<?> getPhongById(@PathVariable("maPhong") String maPhong) {
        try {
            Phong phong = phongService.getByMaPhong(maPhong);
            return ResponseEntity.ok(PhongResponse.fromPhong(phong));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{maPhong}")
    public ResponseEntity<?> updatePhong(@PathVariable("maPhong") String maPhong, @RequestBody PhongDto phongDTO) {
        try {
            Phong phong = phongService.updatePhong(maPhong, phongDTO);
            return ResponseEntity.ok(PhongResponse.fromPhong(phong));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/{maPhong}")
    public ResponseEntity<?> deletePhong(@PathVariable("maPhong") String maPhong) {
        try {
            phongService.deletePhong(maPhong);
            return ResponseEntity.ok("Đã xóa phòng có mã: " + maPhong);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
