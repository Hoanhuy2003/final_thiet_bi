package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NguoiDungDto {
    @JsonProperty("ma_nd")
    private String maND;

    @JsonProperty("ten_nd")
    private String tenND;

    @JsonProperty("email")
    private String email;

    @JsonProperty("ma_vai_tro")
    private String maVaiTro;

    @JsonProperty("ten_vai_tro")
    private String tenVaiTro;

    @JsonProperty("ma_don_vi")
    private String maDonVi;

    @JsonProperty("ten_don_vi")
    private String tenDonVi;
}