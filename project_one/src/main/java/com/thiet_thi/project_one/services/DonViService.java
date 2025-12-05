package com.thiet_thi.project_one.services;
import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
@RequiredArgsConstructor



public class DonViService {
    private final DonViRepository donViRepository;

    public List<DonVi> getAllFaculties() {
        return donViRepository.findAll();
    }
}
