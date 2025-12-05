package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DonViDto {
    @JsonProperty("ma_don_vi")
    private String maDonVi;

    @JsonProperty("ten_don_vi")
    private String tenDonVi;

    @JsonProperty("nguoi_dungs")
    private List<NguoiDungDto> nguoiDungs;

    @JsonProperty("phongs")
    private List<PhongDto> phongs;
}