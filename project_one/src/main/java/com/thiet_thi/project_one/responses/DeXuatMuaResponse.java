package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeXuatMuaResponse {

    private String maDeXuat;
    private String tieuDe;
    private String noiDung;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayTao;

    private String trangThai;

    // Thông tin người tạo (Flatten data - Làm phẳng dữ liệu)
    private String maNguoiTao;
    private String tenNguoiTao;

    // Thông tin người duyệt
    private String maNguoiDuyet;
    private String tenNguoiDuyet;

    // === CÁI FRONTEND CẦN NHẤT: TỔNG TIỀN ===
    private BigDecimal tongTien;

    // Danh sách chi tiết (nếu cần hiển thị luôn)
    private List<ChiTietResponse> chiTiet;

    // Helper class nhỏ để map chi tiết
    @Getter @Setter @Builder
    public static class ChiTietResponse {
        private String maCTDX;
        private String tenLoaiThietBi;
        private Integer soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
    }

    public static DeXuatMuaResponse from(DeXuatMua entity) {
        // 1. Tính tổng tiền & Map danh sách chi tiết
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<ChiTietResponse> listChiTiet = new ArrayList<>();

        if (entity.getChiTietDeXuat() != null) {
            for (ChiTietDeXuatMua ct : entity.getChiTietDeXuat()) {
                BigDecimal thanhTien = ct.getDonGia().multiply(BigDecimal.valueOf(ct.getSoLuong()));
                totalAmount = totalAmount.add(thanhTien);

                listChiTiet.add(ChiTietResponse.builder()
                        .maCTDX(ct.getMaCTDX())
                        .tenLoaiThietBi(ct.getLoaiThietBi().getTenLoai())
                        .soLuong(ct.getSoLuong())
                        .donGia(ct.getDonGia())
                        .thanhTien(thanhTien)
                        .build());
            }
        }

        // 2. Build Response
        return DeXuatMuaResponse.builder()
                .maDeXuat(entity.getMaDeXuat())
                .tieuDe(entity.getTieuDe())
                .noiDung(entity.getNoiDung())
                .ngayTao(entity.getNgayTao())
                .trangThai(entity.getTrangThai())

                // Map User
                .maNguoiTao(entity.getNguoiTao().getMaND())
                .tenNguoiTao(entity.getNguoiTao().getTenND())

                // Map Approver (Check null vì mới tạo chưa có người duyệt)
                .maNguoiDuyet(entity.getNguoiDuyet() != null ? entity.getNguoiDuyet().getMaND() : null)
                .tenNguoiDuyet(entity.getNguoiDuyet() != null ? entity.getNguoiDuyet().getTenND() : null)

                // Gán tổng tiền đã tính
                .tongTien(totalAmount)
                .chiTiet(listChiTiet)
                .build();
    }
}