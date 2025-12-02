// 1. PHIEU_THANH_LY.java
package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "phieu_thanh_ly")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder(toBuilder = true)
public class PhieuThanhLy {

    @Id
    @Column(name = "ma_phieu_thanh_ly", length = 20)
    private String maPhieuThanhLy;                  // TL2025-001

    @Column(name = "so_phieu", length = 50, unique = true, nullable = false)
    private String soPhieu;

    @Column(name = "ngay_lap", nullable = false)
    private LocalDate ngayLap = LocalDate.now();

    @Column(name = "ngay_thanh_ly")
    private LocalDate ngayThanhLy;

    @Column(name = "hinh_thuc", length = 100, nullable = false)
    private String hinhThuc;                        // Bán thanh lý, Tiêu hủy, Đấu giá...

    @Column(name = "ly_do_thanh_ly", length = 500)
    private String lyDoThanhLy;

    @Column(name = "tong_gia_tri_thu_ve", precision = 18, scale = 2)
    private BigDecimal tongGiaTriThuVe = BigDecimal.ZERO;

    @Column(name = "trang_thai", length = 50, nullable = false)
    private String trangThai = "Chờ duyệt";

    @Column(name = "ghi_chu", length = 1000)
    private String ghiChu;

    // Người lập phiếu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd_lap", nullable = false)
    private NguoiDung nguoiLap;

    // Người duyệt phiếu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd_duyet")
    private NguoiDung nguoiDuyet;

    @Column(name = "ngay_duyet")
    private LocalDate ngayDuyet;

    // Quan hệ 1 phiếu → nhiều chi tiết
    @OneToMany(mappedBy = "phieuThanhLy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ChiTietPhieuThanhLy> chiTiet = new HashSet<>();
}