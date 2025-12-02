package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoThietBiDto {
    @JsonProperty("ma_lo")
    private String maLo;

    @JsonProperty("ma_ctdx")
    private String maCTDX;

    @JsonProperty("ten_lo")
    private String tenLo;

    @JsonProperty("so_luong")
    private Integer soLuong;

    @JsonProperty("ngay_nhap")
    private LocalDate ngayNhap;

    @JsonProperty("ghi_chu")
    private String ghiChu;
}