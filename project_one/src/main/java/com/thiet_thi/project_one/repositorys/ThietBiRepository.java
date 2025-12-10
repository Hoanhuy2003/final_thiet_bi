package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.ThietBi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ThietBiRepository extends JpaRepository<ThietBi, String> {
    long countByPhong_DonVi_MaDonVi(String maDonVi);

    @Query("SELECT tb FROM ThietBi tb WHERE " +
            "(:search IS NULL OR lower(tb.tenTB) LIKE lower(concat('%', :search, '%')) OR " +
            "lower(tb.maTB) LIKE lower(concat('%', :search, '%')) OR " +
            "lower(tb.soSeri) LIKE lower(concat('%', :search, '%'))) AND " +

            "(:maLoai IS NULL OR tb.loaiThietBi.maLoai = :maLoai) AND " +

            "(:tinhTrang IS NULL OR tb.tinhTrang = :tinhTrang) AND " +

            "(:maPhong IS NULL OR tb.phong.maPhong = :maPhong)")
    Page<ThietBi> findByCriteria(
            @Param("search") String search,
            @Param("maLoai") String maLoai,
            @Param("tinhTrang") String tinhTrang,
            @Param("maPhong") String maPhong,
            Pageable pageable);
    
}



