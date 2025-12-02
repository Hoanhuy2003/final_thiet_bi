package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.LichSuThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LichSuThietBiRepository extends JpaRepository<LichSuThietBi, String> {

    // Cách 2: Dùng @Query native – CHẮC CHẮN CHẠY 100%
    @Query(value = "SELECT * FROM lich_su_thiet_bi WHERE ma_tb = :maTB ORDER BY ngay_thay_doi DESC", nativeQuery = true)
    List<LichSuThietBi> findLichSuByMaTB(@Param("maTB") String maTB);
}
