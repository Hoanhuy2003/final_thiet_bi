package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NguoiDungDto {
    @JsonProperty("ma_nd")
    private String maND;

    @JsonProperty("mat_khau")
    private String matKhau;

    @JsonProperty("ten_nd")
    private String tenND;

    @JsonProperty("email")
    private String email;

    @JsonProperty("ma_vai_tro")
    private String maVaiTro;

    @JsonProperty("trang_thai")
    private String trangThai;

    @JsonProperty("so_dien_thoai")
    private String soDienThoai;

    @JsonProperty("ma_don_vi")
    private String maDonVi;
}