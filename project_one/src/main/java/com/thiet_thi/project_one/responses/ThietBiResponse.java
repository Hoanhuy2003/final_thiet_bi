package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.thiet_thi.project_one.models.ThietBi;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ThietBiResponse {

    private String maTB;
    private String tenTB;
    private String lo;
    private String loai;
    private String phong;
    private String donVi;
    private String tinhTrang;
    private BigDecimal giaTriBanDau;
    private BigDecimal giaTriHienTai;
    private String soSeri;
    private String thongSoKyThuat;
    private String nhaCungCap;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngaySuDung;

    // Dành riêng cho chi tiết
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayMua;

    private String nguyenGiaFormatted;
    private String giaTriConLaiFormatted;

    private List<LichSuHoatDong> lichSuHoatDong;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LichSuHoatDong {
        private String noiDung;
        private LocalDate ngayThayDoi;
        private String nguoiThucHien;
        private String hanhDong;
    }

    // Dùng cho danh sách (nhẹ)
    public static ThietBiResponse fromThietBi(ThietBi tb) {

        BigDecimal calculatedGiaTriHienTai = tb.getGiaTriHienTai(); // Giá trị hiện tại từ DB (có thể null)

        // --- LOGIC TÍNH KHẤU HAO ĐỘNG – CHỐNG NULL ---
        if (tb.getNgaySuDung() != null &&
                tb.getLoaiThietBi() != null &&
                tb.getLoaiThietBi().getThoiGianKhauHao() != null &&
                tb.getLoaiThietBi().getThoiGianKhauHao() > 0 &&
                tb.getGiaTriBanDau() != null &&
                tb.getGiaTriBanDau().compareTo(BigDecimal.ZERO) > 0) { // THÊM KIỂM TRA NULL

            int soNamKhauHao = tb.getLoaiThietBi().getThoiGianKhauHao();

            long soNamDaDung = ChronoUnit.YEARS.between(tb.getNgaySuDung(), LocalDate.now());

            BigDecimal khauHaoMoiNam = tb.getGiaTriBanDau().divide(
                    BigDecimal.valueOf(soNamKhauHao), 4, RoundingMode.HALF_UP);

            BigDecimal tongHaoMon = khauHaoMoiNam.multiply(BigDecimal.valueOf(soNamDaDung));

            calculatedGiaTriHienTai = tb.getGiaTriBanDau().subtract(tongHaoMon);

            if (calculatedGiaTriHienTai.compareTo(BigDecimal.ZERO) < 0) {
                calculatedGiaTriHienTai = BigDecimal.ZERO;
            }
        } else {
            // Nếu không đủ điều kiện tính khấu hao → giữ nguyên giá trị DB hoặc 0
            calculatedGiaTriHienTai = tb.getGiaTriHienTai() != null ? tb.getGiaTriHienTai() : BigDecimal.ZERO;
        }

        // Logic trạng thái hết khấu hao
        String trangThaiHienThi = tb.getTinhTrang();
        if (calculatedGiaTriHienTai.compareTo(BigDecimal.ZERO) == 0 &&
                !"Đã thanh lý".equals(trangThaiHienThi) &&
                !"Chờ thanh lý".equals(trangThaiHienThi)) {
            trangThaiHienThi = "Hết khấu hao";
        }
        String tenNhaCungCap = null;
        if(tb.getMaNhaCungCap() != null) {
            tenNhaCungCap = tb.getMaNhaCungCap().getTen();
        }
        return ThietBiResponse.builder()
                .maTB(tb.getMaTB())
                .tenTB(tb.getTenTB())
                .lo(tb.getLoThietBi() != null ? tb.getLoThietBi().getTenLo() : null)
                .loai(tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : "Chưa xác định")
                .phong(tb.getPhong() != null ? tb.getPhong().getTenPhong() : "Chưa phân bổ")
                .donVi(tb.getPhong() != null && tb.getPhong().getDonVi() != null
                        ? tb.getPhong().getDonVi().getTenDonVi() : null)
                .tinhTrang(trangThaiHienThi)
                .giaTriBanDau(tb.getGiaTriBanDau())
                .giaTriHienTai(calculatedGiaTriHienTai) // Giá trị an toàn
                .ngaySuDung(tb.getNgaySuDung())
                .nhaCungCap(tenNhaCungCap)
                .soSeri(tb.getSoSeri())
                .thongSoKyThuat(tb.getThongSoKyThuat())
                .build();
    }

    // gọi fromThietBi để lấy logic khấu hao
    public static ThietBiResponse fromThietBiDetail(ThietBi tb, List<LichSuHoatDong> lichSu) {
        ThietBiResponse resp = fromThietBi(tb); // Vẫn gọi hàm fromThietBi để có logic khấu hao

        resp.setNgayMua(tb.getNgaySuDung());

        if (resp.getGiaTriBanDau() != null) {
            resp.setNguyenGiaFormatted(String.format("%,.0fđ", resp.getGiaTriBanDau()));
        }
        if (resp.getGiaTriHienTai() != null) {
            // Dùng giá trị đã được tính toán động (resp.getGiaTriHienTai)
            resp.setGiaTriConLaiFormatted(String.format("%,.0fđ", resp.getGiaTriHienTai()));
        }

        resp.setLichSuHoatDong(lichSu);
        return resp;
    }
}
