// <<<<<<< HEAD
// // src/main/java/com/thiet_thi/project_one/responses/DonViResponse.java
// package com.thiet_thi.project_one.responses;

// import com.thiet_thi.project_one.models.DonVi;
// import lombok.*;
// import java.util.List;

// @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
// public class DonViResponse {

//     private String maDonVi;
//     private String tenDonVi;
//     private Long soPhong;
//     private Long soNguoiDung;

//     private List<PhongTrongDonVi> dsPhong;
//     private List<NguoiDungTrongDonVi> dsNguoiDung;

//     @Getter @Setter @Builder
//     public static class PhongTrongDonVi {
//         private String maPhong;
//         private String tenPhong;
//     }

//     @Getter @Setter @Builder
//     public static class NguoiDungTrongDonVi {
//         private String maNd;
//         private String tenNd;
//         private String email;
//     }

//     public static DonViResponse from(DonVi donVi) {
//         List<PhongTrongDonVi> phongList = donVi.getDsPhong().stream()
//                 .map(p -> PhongTrongDonVi.builder()
//                         .maPhong(p.getMaPhong())
//                         .tenPhong(p.getTenPhong())
//                         .build())
//                 .toList();

//         List<NguoiDungTrongDonVi> ndList = donVi.getDsNguoiDung().stream()
//                 .map(nd -> NguoiDungTrongDonVi.builder()
//                         .maNd(nd.getMaND())
//                         .tenNd(nd.getTenND())
//                         .email(nd.getEmail())
//                         .build())
//                 .toList();

//         return DonViResponse.builder()
//                 .maDonVi(donVi.getMaDonVi())
//                 .tenDonVi(donVi.getTenDonVi())
//                 .soPhong((long) phongList.size())
//                 .soNguoiDung((long) ndList.size())
//                 .dsPhong(phongList)
//                 .dsNguoiDung(ndList)
//                 .build();
//     }
// }

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

