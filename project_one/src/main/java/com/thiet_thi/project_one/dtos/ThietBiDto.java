package com.thiet_thi.project_one.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ThietBiDto {
    @JsonProperty("ma_tb")
    private String maTB;

    @JsonProperty("ma_lo")
    private String maLo;

    @JsonProperty("ma_loai")
    private String maLoai;

    @JsonProperty("ten_loai")
    private String tenLoai;

    @JsonProperty("ten_tb")
    private String tenTB;

    @JsonProperty("ma_phong")
    private String maPhong;

    @JsonProperty("ten_phong")
    private String tenPhong;

    @JsonProperty("tinh_trang")
    private String tinhTrang;

    @JsonProperty("gia_tri_ban_dau")
    private BigDecimal giaTriBanDau;

    @JsonProperty("gia_tri_hien_tai")
    private BigDecimal giaTriHienTai;

    @JsonProperty("ngay_su_dung")
    private LocalDate ngaySuDung;
}