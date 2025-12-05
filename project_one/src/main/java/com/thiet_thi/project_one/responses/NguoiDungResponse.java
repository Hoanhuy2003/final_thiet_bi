package com.thiet_thi.project_one.responses;


import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.models.NguoiDung;
import com.thiet_thi.project_one.models.VaiTro;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NguoiDungResponse {

    private String maNguoiDung;
    private String hoTen;
    private String email;
    private VaiTroResponse maVaiTro;
    private String trangThai;
    private DonViResponse donVi;
    private String soDienThoai;

    public static NguoiDungResponse fromNguoiDung(NguoiDung nd) {
        return  NguoiDungResponse.builder()
                .maNguoiDung(nd.getMaND())
                .hoTen(nd.getTenND())
                .email(nd.getEmail())
                .maVaiTro(VaiTroResponse.fromVaiTro(nd.getVaiTro()))
                .trangThai(nd.getTrangThai())
                .soDienThoai(nd.getSoDienThoai())
                .donVi(DonViResponse.fromDonVi(nd.getDonVi()))
                .build();
    }

}
