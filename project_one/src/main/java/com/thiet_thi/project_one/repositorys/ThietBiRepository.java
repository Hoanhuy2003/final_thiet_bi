package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.ThietBi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThietBiRepository extends JpaRepository<ThietBi, String> {

    long countByMaDonVi(String maDonVi);
}
