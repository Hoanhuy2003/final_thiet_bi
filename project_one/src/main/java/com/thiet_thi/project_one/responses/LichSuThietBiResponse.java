// src/main/java/com/thiet_thi/project_one/responses/LichSuThietBiResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.LichSuThietBi;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LichSuThietBiResponse {

    private String maLichSu;
    private String maTB;
    private String tenTB;

    // Trạng thái
    private String trangThaiCu;
    private String trangThaiMoi;

    // Phòng
    private String phongCu;
    private String phongMoi;

    // Loại thiết bị
    private String loaiCu;
    private String loaiMoi;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayThayDoi;

    private String maND;
    private String tenNguoiThayDoi;

    // Chuyển từ Entity → Response
    public static LichSuThietBiResponse fromLichSu(LichSuThietBi ls) {
        return LichSuThietBiResponse.builder()
                .maLichSu(ls.getMaLichSu())
                .maTB(ls.getThietBi().getMaTB())
                .tenTB(ls.getThietBi().getTenTB())
                .trangThaiCu(ls.getTrangThaiCu())
                .trangThaiMoi(ls.getTrangThaiMoi())
                .phongCu(ls.getPhongCu())
                .phongMoi(ls.getPhongMoi())
                .loaiCu(ls.getLoaiCu())
                .loaiMoi(ls.getLoaiMoi())
                .ngayThayDoi(ls.getNgayThayDoi())
                .maND(ls.getNguoiThayDoi() != null ? ls.getNguoiThayDoi().getMaND() : null)
                .tenNguoiThayDoi(ls.getNguoiThayDoi() != null ? ls.getNguoiThayDoi().getTenND() : "Hệ thống")
                .build();
    }
}