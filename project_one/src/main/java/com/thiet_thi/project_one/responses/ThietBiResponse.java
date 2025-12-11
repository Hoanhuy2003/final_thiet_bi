package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.thiet_thi.project_one.models.ThietBi;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode; // <-- CẦN THÊM IMPORT NÀY
import java.time.LocalDate;
import java.time.temporal.ChronoUnit; // <-- CẦN THÊM IMPORT NÀY
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

        BigDecimal calculatedGiaTriHienTai = tb.getGiaTriHienTai();

        // --- LOGIC TÍNH KHẤU HAO ĐỘNG ---
        if (tb.getNgaySuDung() != null &&
                tb.getLoaiThietBi() != null &&
                tb.getLoaiThietBi().getThoiGianKhauHao() != null &&
                tb.getLoaiThietBi().getThoiGianKhauHao() > 0 &&
                tb.getGiaTriBanDau() != null &&
                tb.getGiaTriBanDau().compareTo(BigDecimal.ZERO) > 0) {

            int soNamKhauHao = tb.getLoaiThietBi().getThoiGianKhauHao();

            // 1. Tính số năm đã sử dụng (đã làm tròn)
            long soNamDaDung = ChronoUnit.YEARS.between(tb.getNgaySuDung(), LocalDate.now());

            // 2. Tính khấu hao một năm (Chia cho số năm Khấu hao)
            BigDecimal khauHaoMoiNam = tb.getGiaTriBanDau().divide(
                    BigDecimal.valueOf(soNamKhauHao), 4, RoundingMode.HALF_UP); // Độ chính xác 4 số thập phân

            // 3. Tính tổng hao mòn lũy kế
            BigDecimal tongHaoMon = khauHaoMoiNam.multiply(BigDecimal.valueOf(soNamDaDung));

            // 4. Giá trị còn lại (Không âm)
            calculatedGiaTriHienTai = tb.getGiaTriBanDau().subtract(tongHaoMon);
            if (calculatedGiaTriHienTai.compareTo(BigDecimal.ZERO) < 0) {
                calculatedGiaTriHienTai = BigDecimal.ZERO;
            }
        }

        // 5. Logic Khấu hao Status (Dựa trên giá trị vừa tính)
        String trangThaiHienThi = tb.getTinhTrang();
        if (calculatedGiaTriHienTai.compareTo(BigDecimal.ZERO) == 0
                && !"Đã thanh lý".equals(trangThaiHienThi)
                && !"Chờ thanh lý".equals(trangThaiHienThi)) {
            trangThaiHienThi = "Hết khấu hao";
        }
        // ----------------------------------------------------

        return ThietBiResponse.builder()
                .maTB(tb.getMaTB())
                .tenTB(tb.getTenTB())
                .lo(tb.getLoThietBi() != null ? tb.getLoThietBi().getTenLo() : null)

                // Fields DTO cũ (String)
                .loai(tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : "Chưa xác định")
                .phong(tb.getPhong() != null ? tb.getPhong().getTenPhong() : "Chưa phân bổ")

                .donVi(tb.getPhong() != null && tb.getPhong().getDonVi() != null
                        ? tb.getPhong().getDonVi().getTenDonVi() : null)

                // Gán Status & Giá trị đã tính toán động
                .tinhTrang(trangThaiHienThi)
                .giaTriBanDau(tb.getGiaTriBanDau())
                .giaTriHienTai(calculatedGiaTriHienTai) // <-- GHI ĐÈ GIÁ TRỊ TÍNH TOÁN

                .ngaySuDung(tb.getNgaySuDung())
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