// src/main/java/com/thiet_thi/project_one/models/BaoCao.java
package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "bao_cao")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder(toBuilder = true)
public class BaoCao {

    @Id
    private String id;

    @Column(name = "ten_bao_cao", nullable = false, length = 200)
    private String tenBaoCao;

    @Column(name = "loai_bao_cao", nullable = false, length = 100)
    private String loaiBaoCao; // Kiểm kê, Thanh lý, Mua sắm, Tổng hợp thiết bị,...

    @Column(name = "tu_ngay")
    private LocalDate tuNgay;

    @Column(name = "den_ngay")
    private LocalDate denNgay;

    @Column(name = "don_vi", length = 100)
    private String donVi;

    @Column(name = "nguoi_tao", length = 100)
    private String nguoiTao;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDate ngayTao = LocalDate.now();

    @Column(name = "duong_dan_file", length = 500)
    private String duongDanFile;

    @Column(name = "kich_thuoc_file", length = 50)
    private String kichThuocFile;

    @Column(name = "trang_thai", length = 50)
    private String trangThai = "Hoàn thành";
}