package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.ThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ThietBiRepository extends JpaRepository<ThietBi, String> {

    // ThietBiRepository.java – SỬA THÀNH CÁI NÀY LÀ XONG!
    @Query("SELECT COUNT(tb) FROM ThietBi tb WHERE tb.phong.donVi.maDonVi = :maDonVi")
    long countByDonVi(@Param("maDonVi") String maDonVi);
}
