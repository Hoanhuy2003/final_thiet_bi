package com.thiet_thi.project_one.controllers;

import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.services.DonViService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/donVi")
@RequiredArgsConstructor
public class DonViController {
    private final DonViService donViService;

        @GetMapping
        public List<DonVi> getFaculties() {
            return donViService.getAllFaculties();
        }

}
