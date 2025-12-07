package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal; // Dùng BigDecimal cho tiền tệ là chuẩn nhất
import java.time.LocalDate;

@Entity
@Table(name = "lo_thiet_bi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoThietBi {

    @Id
    @Column(name = "ma_lo", length = 50)
    private String maLo;

    @Column(name = "ten_lo", nullable = false, length = 200)
    private String tenLo;

    // --- CÁC LIÊN KẾT (GIỮ NGUYÊN) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai", nullable = false)
    private LoaiThietBi loaiThietBi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_ctdx", nullable = false)
    private ChiTietDeXuatMua chiTietDeXuatMua;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_ncc")
    private NhaCungCap nhaCungCap;


    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "don_gia", precision = 15, scale = 2)
    private BigDecimal donGia;


    @Column(name = "so_hoa_don", length = 50)
    private String soHoaDon;

    @Column(name = "ngay_hoa_don")
    private LocalDate ngayHoaDon;

    @Column(name = "ngay_nhap")
    private LocalDate ngayNhap;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;
}