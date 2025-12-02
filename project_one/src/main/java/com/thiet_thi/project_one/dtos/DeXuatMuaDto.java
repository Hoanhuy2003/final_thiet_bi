package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeXuatMuaDto {
    @JsonProperty("ma_de_xuat")
    private String maDeXuat;

    @JsonProperty("tieu_de")
    private String tieuDe;

    @JsonProperty("noi_dung")
    private String noiDung;

    @JsonProperty("ngay_tao")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayTao;

    @JsonProperty("trang_thai")
    private String trangThai;

    @JsonProperty("ma_nd")
    private String maND;

    @JsonProperty("ten_nguoi_tao")
    private String tenNguoiTao;

    @JsonProperty("chi_tiet")
    private List<ChiTietDeXuatMuaDto> chiTiet = new ArrayList<>();
}
