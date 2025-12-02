package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lo_thiet_bi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoThietBi {

    @Id
    @Column(name = "ma_lo")
    private String maLo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_ctdx")
    private ChiTietDeXuatMua chiTietDeXuatMua;

    @Column(name = "ten_lo", length = 200)
    private String tenLo;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "ngay_nhap")
    private LocalDate ngayNhap;

    @Column(name = "ghi_chu", length = 200)
    private String ghiChu;
}