package com.thiet_thi.project_one.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ChiTietThanhLyDto {

    @JsonProperty("ma_cttl")
    private String maCTTL;

    @JsonProperty("ma_phieu_thanh_ly")
    private String maPhieuThanhLy;

    // === THÔNG TIN THIẾT BỊ BỊ THANH LÝ ===
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

    @JsonProperty("tinh_trang")
    private String tinhTrang; // Ví dụ: Hỏng, Mục nát, Hết khấu hao...

    @JsonProperty("trang_thai")
    private String trangThai; // "Duyệt", "Từ chối", "Chờ duyệt"

    // === THÔNG TIN KẾ TOÁN TRƯỚC THANH LÝ ===
    @JsonProperty("nguyen_gia")
    private BigDecimal nguyenGia;

    @JsonProperty("gia_tri_con_lai")
    private BigDecimal giaTriConLai;

    @JsonProperty("so_nam_su_dung")
    private Integer soNamSuDung;

    // === THÔNG TIN THANH LÝ THỰC TẾ ===
    @JsonProperty("hinh_thuc_thanh_ly")
    private String hinhThucThanhLy; // Bán thanh lý, Tiêu hủy, Đấu giá, Tặng...

    @JsonProperty("ly_do_thanh_ly")
    private String lyDoThanhLy;

    @JsonProperty("gia_tri_thu_ve")
    private BigDecimal giaTriThuVe;

    @JsonProperty("ngay_thanh_ly")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayThanhLy;

    @JsonProperty("ghi_chu")
    private String ghiChu;

    // === NGƯỜI DUYỆT CHI TIẾT (NẾU CÓ) ===
    @JsonProperty("ma_nguoi_duyet")
    private String maNguoiDuyet;

    @JsonProperty("ten_nguoi_duyet")
    private String tenNguoiDuyet;
}