// src/main/java/com/thiet_thi/project_one/dtos/BaoCaoDto.java
package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BaoCaoDto {

    @JsonProperty("ma_bao_cao")
    private String maBaoCao;

    @JsonProperty("loai_bao_cao")
    @NotBlank(message = "Loại báo cáo không được để trống")
    private String loaiBaoCao;

    @JsonProperty("tu_ngay")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "Từ ngày không được để trống")
    private LocalDate tuNgay;

    @JsonProperty("den_ngay")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "Đến ngày không được để trống")
    private LocalDate denNgay;

    @JsonProperty("don_vi")
    private String donVi;

    @JsonProperty("nguoi_tao")
    @NotBlank(message = "Người tạo không được để trống")
    private String nguoiTao;

    // Các trường chỉ trả về
    @JsonProperty("ten_bao_cao")
    private String tenBaoCao;

    @JsonProperty("ngay_tao")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayTao;

    @JsonProperty("duong_dan_file")
    private String duongDanFile;

    @JsonProperty("kich_thuoc_file")
    private String kichThuocFile;

    @JsonProperty("trang_thai")
    private String trangThai;
}