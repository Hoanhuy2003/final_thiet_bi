package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonViService {
    private final DonViRepository donViRepository;

    public List<DonVi> getAllFaculties() {
        return donViRepository.findAll();
    }
}
