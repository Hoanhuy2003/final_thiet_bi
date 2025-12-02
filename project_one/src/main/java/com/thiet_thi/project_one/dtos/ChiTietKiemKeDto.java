package com.thiet_thi.project_one.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChiTietKiemKeDto {

    @JsonProperty("ma_ctkk")
    private String maCTKK;

    @JsonProperty("ma_tb")
    private String maTB;

    @JsonProperty("ten_tb")
    private String tenTB;

    @JsonProperty("ma_loai")
    private String maLoai;

    @JsonProperty("ten_loai")
    private String tenLoai;

    @JsonProperty("ma_phong")
    private String maPhong;

    @JsonProperty("ten_phong")
    private String tenPhong;

    // Tình trạng theo hệ thống (trước kiểm kê)
    @JsonProperty("tinh_trang_he_thong")
    private String tinhTrangHeThong;

    // Người kiểm kê ghi nhận thực tế → dùng để phân loại
    @JsonProperty("tinh_trang_thuc_te")
    private String tinhTrangThucTe;

    // Phân loại tự động theo từ khóa thực tế (rất phổ biến ở VN)
    @JsonProperty("ket_qua_kiem_ke")
    private String ketQuaKiemKe; // "tồn tại", "hỏng", "mất"

    @JsonProperty("ghi_chu")
    private String ghiChu;
}