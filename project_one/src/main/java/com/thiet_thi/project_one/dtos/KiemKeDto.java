package com.thiet_thi.project_one.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiemKeDto {

    // --- CÁC TRƯỜNG XÁC THỰC VÀ ĐỊNH DANH ---

    @JsonProperty("ma_kiem_ke") // ID của Phiếu kiểm kê đang được cập nhật
    private String maKiemKe;

    @JsonProperty("ma_phong") // BẮT BUỘC: ID phòng đang kiểm kê
    private String maPhong;

    @JsonProperty("ma_nguoi_kiem_ke") // Người thực hiện
    private String maNguoiKiemKe;

    @JsonProperty("ghi_chu") // Ghi chú chung
    private String ghiChu;
    @JsonProperty("ngay_kiem_ke")
    private LocalDate ngayKiemKe;

    @JsonProperty("chi_tiet")
    private List<ChiTietKiemKeDto> chiTiet = new ArrayList<>();

}