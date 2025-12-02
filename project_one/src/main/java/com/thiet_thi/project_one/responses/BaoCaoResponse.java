// src/main/java/com/thiet_thi/project_one/responses/BaoCaoResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.thiet_thi.project_one.models.BaoCao;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class BaoCaoResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("ten_bao_cao")
    private String tenBaoCao;

    @JsonProperty("loai_bao_cao")
    private String loaiBaoCao;

    @JsonProperty("tu_ngay")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate tuNgay;

    @JsonProperty("den_ngay")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate denNgay;

    @JsonProperty("don_vi")
    private String donVi;

    @JsonProperty("nguoi_tao")
    private String nguoiTao;

    @JsonProperty("ngay_tao")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayTao;

    @JsonProperty("duong_dan_file")
    private String duongDanFile;

    @JsonProperty("kich_thuoc_file")
    private String kichThuocFile;

    @JsonProperty("trang_thai")
    private String trangThai;

    // Method chuyển từ Entity → Response (siêu tiện!)
    public static BaoCaoResponse fromEntity(BaoCao bc) {
        return BaoCaoResponse.builder()
                .id(bc.getId())
                .tenBaoCao(bc.getTenBaoCao())
                .loaiBaoCao(bc.getLoaiBaoCao())
                .tuNgay(bc.getTuNgay())
                .denNgay(bc.getDenNgay())
                .donVi(bc.getDonVi())
                .nguoiTao(bc.getNguoiTao())
                .ngayTao(bc.getNgayTao())
                .duongDanFile(bc.getDuongDanFile())
                .kichThuocFile(bc.getKichThuocFile())
                .trangThai(bc.getTrangThai())
                .build();
    }
}