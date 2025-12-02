// src/main/java/com/thiet_thi/project_one/responses/DashboardResponse.java
package com.thiet_thi.project_one.responses;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {

    // 4 ô trên cùng
    private Long tongThietBi;
    private String tangTruongThietBi;

    private Long dangHoatDong;
    private String tyLeHoatDong;

    private Long canBaoTri;
    private String canBaoTriQuaHan;

    private BigDecimal giaTriTaiSan;
    private String ghiChuGiaTri;

    // Biểu đồ cột: Thiết bị theo đơn vị
    private List<Map<String, Object>> thietBiTheoDonVi;

    // Biểu đồ tròn: Trạng thái thiết bị
    private List<Map<String, Object>> trangThaiThietBi;

    // Hoạt động gần đây (5 hoạt động mới nhất)
    private List<HoatDongGanDay> hoatDongGanDay;

    @Getter @Setter @Builder
    public static class HoatDongGanDay {
        private String loai;          // "Nhập kho", "Kiểm kê", "Thanh lý", "Đề xuất mua", "Thanh lý"
        private String tieuDe;
        private String noiDung;
        private String nguoiThucHien;
        private String thoiGian;      // "10 phút trước", "2 giờ trước", "Hôm qua"
    }
}