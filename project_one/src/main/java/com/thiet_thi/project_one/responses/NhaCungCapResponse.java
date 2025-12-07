package com.thiet_thi.project_one.responses;

import com.thiet_thi.project_one.models.NhaCungCap;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NhaCungCapResponse {
    private String maNhaCungCap;
    private String ten;
    private String diaChi;
    private String soDienThoai;
    private String email;
    private String maSoThue;

    // Hàm chuyển đổi từ Entity sang Response
    public static NhaCungCapResponse from(NhaCungCap ncc) {
        return NhaCungCapResponse.builder()
                .maNhaCungCap(ncc.getMaNhaCungCap())
                .ten(ncc.getTen())
                .diaChi(ncc.getDiaChi())
                .soDienThoai(ncc.getSoDienThoai())
                .email(ncc.getEmail())
                .maSoThue(ncc.getMaSoThue())
                .build();
    }
}