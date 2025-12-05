package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ma_nd", length = 50, nullable = false)
    private String maND;

    @Column(name = "ten_nd", nullable = false, length = 100)
    private String tenND;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "mat_khau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_vai_tro", referencedColumnName = "ma_vai_tro", nullable = false)
    private VaiTro vaiTro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_vi", referencedColumnName = "ma_don_vi")
    private DonVi donVi;
}
