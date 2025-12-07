package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.iservices.ILoaiThietBiService;
import com.thiet_thi.project_one.responses.LoaiThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loai_thiet_bi")
@RequiredArgsConstructor
public class LoaiThietBiController {

    private final ILoaiThietBiService service;

    @GetMapping
    public List<LoaiThietBiResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public LoaiThietBiResponse getById(@PathVariable String id) {
        return service.getById(id);
    }
}
