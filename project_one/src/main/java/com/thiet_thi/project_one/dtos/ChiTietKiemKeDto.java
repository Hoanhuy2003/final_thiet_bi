package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ChiTietKiemKeDto {

    @JsonProperty("ma_tb")
    private String maTB;

    @JsonProperty("tinh_trang_thuc_te")
    private String tinhTrangThucTe;

    @JsonProperty("ghi_chu")
    private String ghiChu;

}