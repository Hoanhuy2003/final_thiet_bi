// src/main/java/com/thiet_thi/project_one/responses/DeXuatMuaResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DeXuatMuaResponse {

    private String maDeXuat;
    private String tieuDe;
    private String noiDung;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayTao;

    private String trangThai;

   // private String maNguoiTao;
    private String tenNguoiTao;
//    private String maNguoiDuyet;
//    private String tenNguoiDuyet;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayDuyet;

    private Integer tongMatHang;
    private BigDecimal tongTien;

    private List<ChiTietResponse> chiTiet;

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChiTietResponse {
        private String maCTDX;
        private String maLoai;
        private String tenLoai;
        private Integer soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
    }

    public static DeXuatMuaResponse from(DeXuatMua deXuat) {
        BigDecimal tongTien = deXuat.getChiTietDeXuat().stream()
                .map(ct -> ct.getDonGia().multiply(BigDecimal.valueOf(ct.getSoLuong())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ChiTietResponse> chiTietList = deXuat.getChiTietDeXuat().stream()
                .map(ct -> ChiTietResponse.builder()
                        .maCTDX(ct.getMaCTDX())
                        .maLoai(ct.getLoaiThietBi().getMaLoai())
                        .tenLoai(ct.getLoaiThietBi().getTenLoai())
                        .soLuong(ct.getSoLuong())
                        .donGia(ct.getDonGia())
                        .thanhTien(ct.getDonGia().multiply(BigDecimal.valueOf(ct.getSoLuong())))
                        .build())
                .collect(Collectors.toList());

        return DeXuatMuaResponse.builder()
                .maDeXuat(deXuat.getMaDeXuat())
                .tieuDe(deXuat.getTieuDe())
                .noiDung(deXuat.getNoiDung())
                .ngayTao(deXuat.getNgayTao())
                .trangThai(deXuat.getTrangThai())
                .tenNguoiTao(deXuat.getNguoiTao().getTenND())
                .tongMatHang(chiTietList.size())
                .tongTien(tongTien)
                .chiTiet(chiTietList)
                .build();
    }
}