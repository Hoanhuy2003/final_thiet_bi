package com.thiet_thi.project_one.dtos;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoaiThietBiDto {
    @JsonProperty("ma_loai")
    private String maLoai;

    @JsonProperty("ten_loai")
    private String tenLoai;

    @JsonProperty("thoi_gian_khau_hao")
    private Integer thoiGianKhauHao;

    @JsonProperty("ti_le_khau_hao")
    private Double tiLeKhauHao;
}