package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PhieuThanhLyDto {

    @JsonProperty("ma_phieu_thanh_ly")
    private String maPhieuThanhLy;

    @JsonProperty("so_phieu")
    private String soPhieu;

    @JsonProperty("hinh_thuc")
    private String hinhThuc;

    @JsonProperty("ly_do_thanh_ly")
    private String lyDoThanhLy;

    @JsonProperty("ghi_chu")
    private String ghiChu;

    @JsonProperty("ngay_lap")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayLap;

    @JsonProperty("ngay_thanh_ly")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayThanhLy;

    @JsonProperty("ngay_duyet")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayDuyet;

    @JsonProperty("trang_thai")
    private String trangThai;

    // Người tạo phiếu
    @JsonProperty("ma_nguoi_tao")
    private String maNguoiTao;

    @JsonProperty("ten_nguoi_tao")
    private String tenNguoiTao;

    // Người duyệt phiếu
    @JsonProperty("ma_nguoi_duyet")
    private String maNguoiDuyet;

    @JsonProperty("ten_nguoi_duyet")
    private String tenNguoiDuyet;

    // Thống kê
    @JsonProperty("tong_thiet_bi")
    private Integer tongThietBi;

    @JsonProperty("tong_gia_tri_thu_ve")
    private BigDecimal tongGiaTriThuVe;

    // Danh sách chi tiết thanh lý
    @JsonProperty("chi_tiet")
    @Builder.Default
    private List<ChiTietThanhLyDto> chiTiet = new ArrayList<>();

    // Tự động tính tổng thiết bị nếu chưa có (rất tiện khi map)
    public Integer getTongThietBi() {
        if (this.tongThietBi != null) {
            return this.tongThietBi;
        }
        return chiTiet != null ? chiTiet.size() : 0;
    }

    // Tự động tính tổng giá trị thu về nếu chưa có
    public BigDecimal getTongGiaTriThuVe() {
        if (this.tongGiaTriThuVe != null && this.tongGiaTriThuVe.compareTo(BigDecimal.ZERO) > 0) {
            return this.tongGiaTriThuVe;
        }
        if (chiTiet == null || chiTiet.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return chiTiet.stream()
                .map(ChiTietThanhLyDto::getGiaTriThuVe)
                .filter(giaTri -> giaTri != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}