package com.thiet_thi.project_one.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "thiet_bi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ThietBi {

    @Id
    @Column(name = "ma_tb", length = 50)
    private String maTB;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_lo")
    @JsonIgnore
    private LoThietBi loThietBi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai", nullable = false)
    private LoaiThietBi loaiThietBi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phong")
    private Phong phong;


    @Column(name = "ten_tb", nullable = false, length = 200)
    private String tenTB;


    @Column(name = "so_seri", length = 100)
    private String soSeri;

    @Column(name = "thong_so_ky_thuat", columnDefinition = "TEXT")
    private String thongSoKyThuat;

    @Column(name = "tinh_trang", nullable = false, length = 50)
    private String tinhTrang;

    @Column(name = "gia_tri_ban_dau", precision = 18, scale = 2)
    private BigDecimal giaTriBanDau;


    @Column(name = "gia_tri_hien_tai", precision = 18, scale = 2)
    private BigDecimal giaTriHienTai;


    @Column(name = "ngay_su_dung")
    private LocalDate ngaySuDung;


    @Column(name = "ngay_cap_nhat")
    private LocalDate ngayCapNhat;
}