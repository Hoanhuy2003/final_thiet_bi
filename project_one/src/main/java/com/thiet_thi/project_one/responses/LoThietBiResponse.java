// src/main/java/com/thiet_thi/project_one/responses/LoThietBiResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LoThietBiResponse {

    private String maLo;
    private String tenLo;
    private Integer soLuong;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayNhap;

    private String ghiChu;

    // Thông tin từ chi tiết đề xuất (nếu có)
    private String maDeXuat;
    private String tieuDeDeXuat;
    private String maLoaiThietBi;
    private String tenLoaiThietBi;

    public static LoThietBiResponse from(LoThietBi lo) {
        ChiTietDeXuatMua ct = lo.getChiTietDeXuatMua();
        DeXuatMua dx = ct != null ? ct.getDeXuatMua() : null;
        LoaiThietBi loai = ct != null ? ct.getLoaiThietBi() : null;

        return LoThietBiResponse.builder()
                .maLo(lo.getMaLo())
                .tenLo(lo.getTenLo())
                .soLuong(lo.getSoLuong())
                .ngayNhap(lo.getNgayNhap())
                .ghiChu(lo.getGhiChu())
                .maDeXuat(dx != null ? dx.getMaDeXuat() : null)
                .tieuDeDeXuat(dx != null ? dx.getTieuDe() : null)
                .maLoaiThietBi(loai != null ? loai.getMaLoai() : null)
                .tenLoaiThietBi(loai != null ? loai.getTenLoai() : null)
                .build();
    }
}