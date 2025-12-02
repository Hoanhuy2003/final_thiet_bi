package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "de_xuat_mua")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)

public class DeXuatMua {

    @Id
    @Column(name = "ma_de_xuat", length = 50, nullable = false)
    private String maDeXuat;

    @Column(name = "tieu_de", length = 200)
    private String tieuDe;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDate ngayTao;

    @Column(name = "trang_thai", nullable = false, length = 50)
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd", referencedColumnName = "ma_nd", nullable = false)
    private NguoiDung nguoiTao;

    @OneToMany(mappedBy = "deXuatMua", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ChiTietDeXuatMua> chiTietDeXuat = new HashSet<>();
}
