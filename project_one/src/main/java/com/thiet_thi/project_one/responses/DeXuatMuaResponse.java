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

    // --- THÔNG TIN NGƯỜI TẠO ---
    private String maNguoiTao;
    private String tenNguoiTao;


    private String tenPhong;
    private String tenDonVi;

    // --- THÔNG TIN NGƯỜI DUYỆT ---
    private String maNguoiDuyet;
    private String tenNguoiDuyet;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayDuyet;

    private BigDecimal tongTien;
    private List<ChiTietResponse> chiTiet;

    @Getter @Setter @Builder
    public static class ChiTietResponse {
        private String maCTDX;
        private String tenLoaiThietBi;
        private Integer soLuong;
        private BigDecimal donGia;
        private String ghiChu;
        private BigDecimal thanhTien;
        private Integer daNhap;
    }

    public static DeXuatMuaResponse from(DeXuatMua entity) {
        // 1. Tính tổng tiền
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
                        .ghiChu(ct.getGhiChu())
                        .daNhap(ct.getSoLuongDaNhap())
                        .thanhTien(thanhTien)
                        .build());
            }
        }

        String tenDonVi = "N/A";
        if (entity.getNguoiTao().getDonVi() != null) {
            tenDonVi = entity.getNguoiTao().getDonVi().getTenDonVi();
        }

        String tenPhong = "Chưa chọn phòng";
        if (entity.getPhong() != null) {
            tenPhong = entity.getPhong().getTenPhong();
        }

        // 3. Build Response
        return DeXuatMuaResponse.builder()
                .maDeXuat(entity.getMaDeXuat())
                .tieuDe(entity.getTieuDe())
                .noiDung(entity.getNoiDung())
                .ngayTao(entity.getNgayTao())
                .trangThai(entity.getTrangThai())

                .maNguoiTao(entity.getNguoiTao().getMaND())
                .tenNguoiTao(entity.getNguoiTao().getTenND())

                .tenPhong(tenPhong)
                .tenDonVi(tenDonVi)

                .maNguoiDuyet(entity.getNguoiDuyet() != null ? entity.getNguoiDuyet().getMaND() : null)
                .tenNguoiDuyet(entity.getNguoiDuyet() != null ? entity.getNguoiDuyet().getTenND() : null)
                .ngayDuyet(entity.getNgayDuyet())

                .tongTien(totalAmount)
                .chiTiet(listChiTiet)
                .build();
    }
}