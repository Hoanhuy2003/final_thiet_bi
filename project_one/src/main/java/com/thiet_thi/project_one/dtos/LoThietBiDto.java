package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoThietBiDto {

    @JsonProperty("ma_lo")
    private String maLo;

    @JsonProperty("ten_lo")
    private String tenLo;


    @JsonProperty("ma_ctdx")
    private String maCTDX;

    @JsonProperty("ma_loai")
    private String maLoai;

    @JsonProperty("ma_ncc")
    private String maNhaCungCap;


    @JsonProperty("so_luong")
    private Integer soLuong;


    @JsonProperty("don_gia")
    private BigDecimal donGia;


    @JsonProperty("ngay_nhap")
    private LocalDate ngayNhap;

    @JsonProperty("so_hoa_don")
    private String soHoaDon;

    @JsonProperty("ngay_hoa_don")
    private LocalDate ngayHoaDon;

    @JsonProperty("trang_thai")
    private Integer trangThai;

    @JsonProperty("ghi_chu")
    private String ghiChu;
}