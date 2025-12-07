package com.thiet_thi.project_one.responses;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiThietBiResponse {
    private String maLoai;
    private String tenLoai;
    private Integer thoiGianKhauHao;
    private Double tiLeKhauHao;
}
