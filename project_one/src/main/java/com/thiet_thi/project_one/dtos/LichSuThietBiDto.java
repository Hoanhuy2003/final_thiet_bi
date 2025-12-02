package com.thiet_thi.project_one.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LichSuThietBiDto {
    @JsonProperty("ma_lich_su")
    private String maLichSu;

    @JsonProperty("ma_tb")
    private String maTB;

    @JsonProperty("ten_tb")
    private String tenTB;

    @JsonProperty("trang_thai_cu")
    private String trangThaiCu;

    @JsonProperty("trang_thai_moi")
    private String trangThaiMoi;

    @JsonProperty("ngay_thay_doi")
    private LocalDate ngayThayDoi;

    @JsonProperty("ma_nd")
    private String maND;

    @JsonProperty("ten_nguoi_thay_doi")
    private String tenNguoiThayDoi;
}