package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "kiem_ke")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KiemKe {

    @Id
    @Column(name = "ma_kiem_ke")
    private String maKiemKe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd", nullable = false)
    private NguoiDung nguoiKiemKe;

    @Column(name = "ngay_kiem_ke", nullable = false)
    private LocalDate ngayKiemKe;

    @Column(name = "ghi_chu", length = 200)
    private String ghiChu;

    @OneToMany(mappedBy = "kiemKe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ChiTietKiemKe> chiTiet = new HashSet<>();
}
