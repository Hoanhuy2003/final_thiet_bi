package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "chi_tiet_kiem_ke")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChiTietKiemKe {

    @Id
    @Column(name = "ma_ctkk")
    private String maCTKK;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_kiem_ke", nullable = false)
    private KiemKe kiemKe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tb", nullable = false)
    private ThietBi thietBi;

    @Column(name = "tinh_trang_thuc_te", length = 200)
    private String tinhTrangThucTe;

    @Column(name = "ghi_chu", length = 200)
    private String ghiChu;

    @Column(name = "tinh_trang_he_thong")
    private String tinhTrangHeThong;
}