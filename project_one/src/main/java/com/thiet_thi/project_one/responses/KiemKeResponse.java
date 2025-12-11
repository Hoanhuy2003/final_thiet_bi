package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.ChiTietKiemKe;
import com.thiet_thi.project_one.models.KiemKe;
import com.thiet_thi.project_one.models.ThietBi;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiemKeResponse {

    private String maKiemKe;
    private String maND;
    private String tenNguoiKiemKe;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayKiemKe;

    private String tenPhong;
    private String trangThai; // Trạng thái phiếu (Mới tạo / Hoàn thành)
    private String ghiChu;
    private String maPhong;
    // --- Thống kê tổng quan ---
    private int tongSoLuong;
    private int tonTai;
    private int hong;
    private int mat;
    private String tyLeDat; // Ví dụ: "96.5%"

    private List<ChiTietKiemKeResponse> chiTiet;

    // ==================== INNER CLASS CHI TIẾT ====================
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ChiTietKiemKeResponse {

        private String maCTKK;
        private String maTB;
        private String tenTB;
        private String tenLoai;
        private String tenPhong;

        // Quan trọng: Trạng thái lúc bắt đầu kiểm kê (Lấy từ lịch sử)
        private String tinhTrangHeThong;

        // Kết quả thực tế kiểm kê
        private String tinhTrangThucTe;

        // Kết quả đánh giá (Tồn tại / Hỏng / Mất)
        private String ketQua;

        private String ghiChu;

        public static ChiTietKiemKeResponse fromChiTietKiemKe(ChiTietKiemKe ct) {
            ThietBi tb = ct.getThietBi();
            // Tự động suy luận kết quả từ trạng thái thực tế
            String ketQua = xacDinhKetQua(ct.getTinhTrangThucTe());

            return ChiTietKiemKeResponse.builder()
                    .maCTKK(ct.getMaCTKK())
                    .maTB(tb.getMaTB()) // Mã và Tên thì lấy từ Thiết bị hiện tại là OK
                    .tenTB(tb.getTenTB())

                    .tenLoai(tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : null)
                    .tenPhong(tb.getPhong() != null ? tb.getPhong().getTenPhong() : null)

                    // --- FIX QUAN TRỌNG: Lấy từ Chi Tiết (Lịch sử) ---
                    // KHÔNG dùng tb.getTinhTrang() vì nó đã bị update thành trạng thái mới rồi
                    .tinhTrangHeThong(ct.getTinhTrangHeThong())
                    // -------------------------------------------------

                    .tinhTrangThucTe(ct.getTinhTrangThucTe())
                    .ketQua(ketQua)
                    .ghiChu(ct.getGhiChu())
                    .build();
        }
    }

    // ==================== HÀM STATIC MAP TỪ ENTITY ====================
    public static KiemKeResponse fromKiemKe(KiemKe kk) {
        List<ChiTietKiemKeResponse> chiTietList = kk.getChiTiet().stream()
                .map(ChiTietKiemKeResponse::fromChiTietKiemKe)
                .toList();

        // 1. Tính toán số lượng dựa trên những gì đã kiểm
        long checkedCount = chiTietList.size();
        int tonTai = (int) chiTietList.stream().filter(c -> "tồn tại".equals(c.getKetQua())).count();
        int hong = (int) chiTietList.stream().filter(c -> "hỏng".equals(c.getKetQua())).count();
        int mat = (int) chiTietList.stream().filter(c -> "mất".equals(c.getKetQua())).count();

        // 2. --- LOGIC MỚI: XÁC ĐỊNH TỔNG SỐ LƯỢNG ---
        int tongSoLuongHienThi;

        // Nếu danh sách chi tiết rỗng (Mới tạo) -> Lấy tổng số thiết bị của Phòng đó
        if (checkedCount == 0 && kk.getPhong() != null && kk.getPhong().getThietBis() != null) {
            tongSoLuongHienThi = kk.getPhong().getThietBis().size();
        } else {
            // Nếu đã có kiểm kê -> Lấy số lượng đã lưu trong phiếu
            tongSoLuongHienThi = (int) checkedCount;
        }
        // --------------------------------------------

        // Tính tỷ lệ (Tránh chia cho 0)
        double tyLe = tongSoLuongHienThi == 0 ? 0 : (double) tonTai / tongSoLuongHienThi * 100;

        return KiemKeResponse.builder()
                .maKiemKe(kk.getMaKiemKe())
                .maND(kk.getNguoiKiemKe().getMaND())
                .tenNguoiKiemKe(kk.getNguoiKiemKe().getTenND())
                .ngayKiemKe(kk.getNgayKiemKe())

                .maPhong(kk.getPhong().getMaPhong()) // Đã thêm ở bước trước
                .tenPhong(kk.getPhong().getTenPhong())
                .trangThai(kk.getTrangThai())
                .ghiChu(kk.getGhiChu())

                // Gán số liệu thống kê chuẩn
                .tongSoLuong(tongSoLuongHienThi)
                .tonTai(tonTai)
                .hong(hong)
                .mat(mat)
                .tyLeDat(String.format("%.1f%%", tyLe))

                .chiTiet(chiTietList)
                .build();
    }

    // Hàm hỗ trợ chuẩn hóa kết quả
    private static String xacDinhKetQua(String tinhTrang) {
        if (tinhTrang == null || tinhTrang.trim().isEmpty()) return "mất";
        String tt = tinhTrang.toLowerCase();

        if (tt.contains("mất") || tt.contains("không thấy") || tt.contains("thất lạc")) return "mất";
        if (tt.contains("hỏng") || tt.contains("hư") || tt.contains("lỗi")) return "hỏng";

        return "tồn tại"; // Các trường hợp còn lại (Tốt, Cũ,...) coi như là Tồn tại
    }
}