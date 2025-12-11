package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.KiemKe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KiemKeRepository extends JpaRepository<KiemKe, String> {
    @Query("SELECT k FROM KiemKe k WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(k.phong.tenPhong) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(k.maKiemKe) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:maPhong IS NULL OR :maPhong = '' OR k.phong.maPhong = :maPhong) " +
            "AND (:trangThai IS NULL OR :trangThai = '' OR k.trangThai = :trangThai)")
    Page<KiemKe> findSessionsWithFilter(
            @Param("keyword") String keyword,
            @Param("maPhong") String maPhong,
            @Param("trangThai") String trangThai,
            Pageable pageable
    );
}
