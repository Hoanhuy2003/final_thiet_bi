package com.thiet_thi.project_one.models;



import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_de_xuat_mua")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChiTietDeXuatMua {

    @Id
    @Column(name = "ma_ctdx")
    private String maCTDX;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_de_xuat", nullable = false)
    @JsonIgnore
    private DeXuatMua deXuatMua;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai", nullable = false)
    private LoaiThietBi loaiThietBi;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "don_gia", nullable = false, precision = 18, scale = 2)
    private BigDecimal donGia;
    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Formula("(SELECT COALESCE(SUM(l.so_luong), 0) FROM lo_thiet_bi l WHERE l.ma_ctdx = ma_ctdx)")
    private Integer soLuongDaNhap;
}
