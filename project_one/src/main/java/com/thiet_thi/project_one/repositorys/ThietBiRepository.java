package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.models.Phong;
import com.thiet_thi.project_one.models.ThietBi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ThietBiRepository extends JpaRepository<ThietBi, String> {
    long countByPhong_DonVi_MaDonVi(String maDonVi);

    // File: ThietBiRepository.java

    @Query("SELECT tb FROM ThietBi tb " +
            "LEFT JOIN tb.phong p " +
            "LEFT JOIN p.donVi dv " +

            "WHERE " +
            "(:search IS NULL OR lower(tb.tenTB) LIKE lower(concat('%', :search, '%')) OR " +
            "lower(tb.maTB) LIKE lower(concat('%', :search, '%')) OR " +
            "lower(tb.soSeri) LIKE lower(concat('%', :search, '%'))) " +

            // Nối điều kiện tiếp theo bằng "AND"
            "AND (:maLoai IS NULL OR tb.loaiThietBi.maLoai = :maLoai) " +

            // Nối tiếp
            "AND (:maPhong IS NULL OR p.maPhong = :maPhong) " +
            "AND (:maDonVi IS NULL OR dv.maDonVi = :maDonVi) " +

            // ĐIỀU KIỆN LỌC TRẠNG THÁI TÍNH TOÁN (HẾT KHẤU HAO)
            "AND (" +
            // Nếu trạng thái tìm kiếm là HẾT KHẤU HAO, kiểm tra giaTriHienTai = 0
            "(:tinhTrang = 'Hết khấu hao' AND tb.giaTriHienTai = 0) OR " +
            // Nếu trạng thái tìm kiếm là trạng thái thường (Đang sử dụng, Hỏng hóc...)
            "(:tinhTrang IS NULL) OR " + // Cho phép không lọc gì cả
            "(tb.tinhTrang = :tinhTrang)" +
            ")"
    )
    Page<ThietBi> findByCriteria(
            @Param("search") String search,
            @Param("maLoai") String maLoai,
            @Param("tinhTrang") String tinhTrang,
            @Param("maPhong") String maPhong,
            @Param("maDonVi") String maDonVi,
            Pageable pageable);
    long countByPhong(Phong phong);
    
}



