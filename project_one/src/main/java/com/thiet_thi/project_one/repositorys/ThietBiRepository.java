package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.ThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ThietBiRepository extends JpaRepository<ThietBi, String> {
    long countByPhong_DonVi_MaDonVi(String maDonVi);


    
}



