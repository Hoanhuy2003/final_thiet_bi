package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChiTietDeXuatMuaDto {
    @JsonProperty("ma_ctdx")
    private String maCTDX;

    @JsonProperty("ma_loai")
    private String maLoai;

    @JsonProperty("ten_loai")
    private String tenLoai;

    @JsonProperty("so_luong")
    private Integer soLuong;

    @JsonProperty("don_gia")
    private BigDecimal donGia;

    @JsonProperty("thanh_tien")
    private BigDecimal thanhTien() {
        return donGia != null && soLuong != null ? donGia.multiply(BigDecimal.valueOf(soLuong)) : BigDecimal.ZERO;
    }
}