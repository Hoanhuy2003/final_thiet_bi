package com.thiet_thi.project_one.responses;

import com.thiet_thi.project_one.models.Phong;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PhongResponse {
    private String maPhong;
    private String tenPhong;
    private String maDonVi;

    private List<ThietBiResponse> thietBis;

    public static PhongResponse fromPhong(Phong phong){
        return PhongResponse.builder()
                .maPhong(phong.getMaPhong())
                .tenPhong(phong.getTenPhong())
                .maDonVi(phong.getDonVi().getTenDonVi())
                .thietBis(
                        phong.getThietBis() != null
                        ? phong.getThietBis().stream()
                                .map(ThietBiResponse::fromThietBi)
                                .collect(Collectors.toList())
                                :null
                )

                .build();
    }
}
