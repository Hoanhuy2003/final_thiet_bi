// com.thiet_thi.project_one.responses.ThietBiResponse
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.thiet_thi.project_one.models.ThietBi;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // LỊCH SỬ HOẠT ĐỘNG - DỰA HOÀN TOÀN VÀO BẢNG lich_su_thiet_bi
    private List<LichSuHoatDong> lichSuHoatDong;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LichSuHoatDong {
        private String noiDung;
        private LocalDate ngayThayDoi;
        private String nguoiThucHien;
        private String hanhDong; // "Thay đổi trạng thái", "Bàn giao phòng", "Cập nhật thông tin"
    }

    // Dùng cho danh sách (nhẹ)
    public static ThietBiResponse fromThietBi(ThietBi tb) {
        return ThietBiResponse.builder()
                .maTB(tb.getMaTB())
                .tenTB(tb.getTenTB())
                .lo(tb.getLoThietBi() != null ? tb.getLoThietBi().getTenLo() : null)
                .loai(tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : "Chưa xác định")
                .phong(tb.getPhong() != null ? tb.getPhong().getTenPhong() : "Chưa phân bổ")
                .donVi(tb.getPhong() != null && tb.getPhong().getDonVi() != null
                        ? tb.getPhong().getDonVi().getTenDonVi() : null)
                .tinhTrang(tb.getTinhTrang())
                .giaTriBanDau(tb.getGiaTriBanDau())
                .giaTriHienTai(tb.getGiaTriHienTai())
                .ngaySuDung(tb.getNgaySuDung())
                .soSeri(tb.getSoSeri())
                .thongSoKyThuat(tb.getThongSoKyThuat())
                .build();
    }

    // DÙNG CHO CHI TIẾT - CÓ LỊCH SỬ THẬT TỪ BẢNG lich_su_thiet_bi
    public static ThietBiResponse fromThietBiDetail(ThietBi tb, List<LichSuHoatDong> lichSu) {
        ThietBiResponse resp = fromThietBi(tb);
        resp.setNgayMua(tb.getNgaySuDung());

        if (tb.getGiaTriBanDau() != null) {
            resp.setNguyenGiaFormatted(String.format("%,.0fđ", tb.getGiaTriBanDau()));
        }
        if (tb.getGiaTriHienTai() != null) {
            resp.setGiaTriConLaiFormatted(String.format("%,.0fđ", tb.getGiaTriHienTai()));
        }

        resp.setLichSuHoatDong(lichSu);
        return resp;
    }
}