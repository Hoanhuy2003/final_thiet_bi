package com.thiet_thi.project_one.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiemKeDto {

    @JsonProperty("ma_kiem_ke")
    private String maKiemKe;

    @JsonProperty("ma_nd")
    private String maND;

    @JsonProperty("ten_nguoi_kiem_ke")
    private String tenNguoiKiemKe;

    @JsonProperty("ngay_kiem_ke")
    private LocalDate ngayKiemKe;

    @JsonProperty("ghi_chu")
    private String ghiChu;

    @JsonProperty("tong_so_theo_so_sach")
    private Integer tongSoTheoSoSach;        // Tổng số thiết bị theo hệ thống (trước kiểm kê)

    @JsonProperty("tong_so_thuc_te")
    private Integer tongSoThucTe;            // Tổng số thiết bị thực tế phát hiện (tồn + hỏng + mất)

    @JsonProperty("ton_tai")
    private Integer tonTai;                  // Có mặt, còn dùng được

    @JsonProperty("hong")
    private Integer hong;                    // Có mặt nhưng hỏng, không dùng được

    @JsonProperty("mat")
    private Integer mat;

    @JsonProperty("chi_tiet")
    private List<ChiTietKiemKeDto> chiTiet = new ArrayList<>();
}