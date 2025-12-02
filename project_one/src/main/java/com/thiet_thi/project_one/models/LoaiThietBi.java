package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

// 1. LoaiThietBi.java
@Entity
@Table(name = "loai_thiet_bi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiThietBi {

    @Id
    @Column(name = "ma_loai")
    private String maLoai;

    @Column(name = "ten_loai", nullable = false, length = 100)
    private String tenLoai;

    @Column(name = "thoi_gian_khau_hao", nullable = false)
    private Integer thoiGianKhauHao;

    @Column(name = "ti_le_khau_hao", nullable = false)
    private Double tiLeKhauHao;
}