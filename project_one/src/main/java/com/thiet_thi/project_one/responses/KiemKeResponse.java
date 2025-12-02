// src/main/java/com/thiet_thi/project_one/responses/KiemKeResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.ChiTietKiemKe;
import com.thiet_thi.project_one.models.KiemKe;
import com.thiet_thi.project_one.models.ThietBi;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiemKeResponse {

    private String maKiemKe;
    private String maND;
    private String tenNguoiKiemKe;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayKiemKe;

    private String ghiChu;

    // Thống kê tổng quan
    private int tongSoLuong;
    private int tonTai;
    private int hong;
    private int mat;
    private String tyLeDat; // "96.5%"

    private List<ChiTietKiemKeResponse> chiTiet;

    // ==================== INNER CLASS CHI TIẾT ====================
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ChiTietKiemKeResponse {

        private String maCTKK;
        private String maTB;
        private String tenTB;
        private String tenLoai;
        private String tenPhong;
        private String tinhTrangHeThong;
        private String tinhTrangThucTe;
        private String ketQua;     // tồn tại / hỏng / mất
        private String ghiChu;

        // Static map từ entity
        public static ChiTietKiemKeResponse fromChiTietKiemKe(ChiTietKiemKe ct) {
            ThietBi tb = ct.getThietBi();
            String ketQua = xacDinhKetQua(ct.getTinhTrangThucTe());

            return ChiTietKiemKeResponse.builder()
                    .maCTKK(ct.getMaCTKK())
                    .maTB(tb.getMaTB())
                    .tenTB(tb.getTenTB())
                    .tenLoai(tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : null)
                    .tenPhong(tb.getPhong() != null ? tb.getPhong().getTenPhong() : null)
                    .tinhTrangHeThong(tb.getTinhTrang())
                    .tinhTrangThucTe(ct.getTinhTrangThucTe())
                    .ketQua(ketQua)
                    .ghiChu(ct.getGhiChu())
                    .build();
        }
    }

    // ==================== HÀM STATIC CHÍNH ====================
    public static KiemKeResponse fromKiemKe(KiemKe kk) {
        List<ChiTietKiemKeResponse> chiTiet = kk.getChiTiet().stream()
                .map(ChiTietKiemKeResponse::fromChiTietKiemKe)
                .toList();

        int tonTai = (int) chiTiet.stream().filter(c -> "tồn tại".equals(c.getKetQua())).count();
        int hong = (int) chiTiet.stream().filter(c -> "hỏng".equals(c.getKetQua())).count();
        int mat = chiTiet.size() - tonTai - hong;

        double tyLe = chiTiet.isEmpty() ? 0 : (double)(tonTai + hong) / chiTiet.size() * 100;

        return KiemKeResponse.builder()
                .maKiemKe(kk.getMaKiemKe())
                .maND(kk.getNguoiKiemKe().getMaND())
                .tenNguoiKiemKe(kk.getNguoiKiemKe().getTenND())
                .ngayKiemKe(kk.getNgayKiemKe())
                .ghiChu(kk.getGhiChu())
                .tongSoLuong(chiTiet.size())
                .tonTai(tonTai)
                .hong(hong)
                .mat(mat)
                .tyLeDat(String.format("%.1f%%", tyLe))
                .chiTiet(chiTiet)
                .build();
    }

    // Hàm hỗ trợ phân loại tự động
    private static String xacDinhKetQua(String tinhTrang) {
        if (tinhTrang == null || tinhTrang.trim().isEmpty()) return "mất";
        String tt = tinhTrang.toLowerCase();
        if (tt.contains("mất") || tt.contains("không thấy") || tt.contains("thiếu")) return "mất";
        if (tt.contains("hỏng") || tt.contains("hư") || tt.contains("lỗi")) return "hỏng";
        return "tồn tại";
    }
}