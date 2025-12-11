package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_thiet_bi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LichSuThietBi {

    @Id
    @Column(name = "ma_lich_su")
    private String maLichSu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tb", nullable = false)
    private ThietBi thietBi;

    @Column(name = "trang_thai_cu", length = 50)
    private String trangThaiCu;

    @Column(name = "trang_thai_moi", length = 50)
    private String trangThaiMoi;

    // Phòng
    @Column(name = "phong_cu", length = 100)
    private String phongCu;

    @Column(name = "phong_moi", length = 100)
    private String phongMoi;

    // Loại thiết bị (nếu cần)
    @Column(name = "loai_cu", length = 100)
    private String loaiCu;

    @Column(name = "loai_moi", length = 100)
    private String loaiMoi;

    @Column(name = "ngay_thay_doi", nullable = false)
    private LocalDate ngayThayDoi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nd", nullable = false)
    private NguoiDung nguoiThayDoi;
}
