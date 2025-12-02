package com.thiet_thi.project_one.dtos;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PhongDto {
    @JsonProperty("ma_phong")
    private String maPhong;

    @JsonProperty("ten_phong")
    private String tenPhong;

    @JsonProperty("ma_don_vi")
    private String maDonVi;

    @JsonProperty("ten_don_vi")
    private String tenDonVi;
}