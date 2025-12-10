package com.thiet_thi.project_one.repositorys;

import com.thiet_thi.project_one.dtos.LoTBStatDto;
import com.thiet_thi.project_one.models.LoThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoThietBiRepository extends JpaRepository<LoThietBi, String> {

    @Query("SELECT COALESCE(SUM(l.soLuong), 0) FROM LoThietBi l WHERE l.chiTietDeXuatMua.maCTDX = :maCTDX")
    Integer sumSoLuongDaNhap(@Param("maCTDX") String maCTDX);

    // 1. Tìm tất cả lô thuộc về một Đề xuất Mua sắm cụ thể
    // LoThietBi -> ChiTietDeXuatMua -> DeXuatMua -> MaDeXuat
    List<LoThietBi> findByChiTietDeXuatMua_DeXuatMua_MaDeXuat(String maDeXuat);

    // 2. Tìm tất cả lô thuộc về một dòng chi tiết cụ thể
    // Giúp kiểm tra xem dòng chi tiết này đã nhập bao nhiêu lô rồi
    List<LoThietBi> findByChiTietDeXuatMua_MaCTDX(String maCTDX);

    // 3. Tìm các lô chưa được xử lý tạo tài sản (TrangThai = 0)
    List<LoThietBi> findByTrangThai(Integer trangThai);

    // 4. Lấy danh sách lô sắp xếp theo ngày nhập mới nhất
    List<LoThietBi> findAllByOrderByNgayNhapDesc();

    @Query("SELECT new com.thiet_thi.project_one.dtos.LoTBStatDto(" +
            "COUNT(l), " +
            "COALESCE(SUM(l.soLuong), 0), " +
            "COALESCE(SUM(l.donGia * l.soLuong), 0)) " +
            "FROM LoThietBi l")
    LoTBStatDto getStatistics();
}