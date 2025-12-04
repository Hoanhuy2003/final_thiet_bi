package com.thiet_thi.project_one.responses;

import com.thiet_thi.project_one.models.DonVi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DonViResponse {
    private String maDonVi;
    private String tenDonVi;

    public static DonViResponse fromDonVi(DonVi dv) {
        if (dv == null) {
            return null; // Admin hoặc user không thuộc đơn vị nào
        }
        return DonViResponse.builder()
                .maDonVi(dv.getMaDonVi())
                .tenDonVi(dv.getTenDonVi())
                .build();
    }
}
