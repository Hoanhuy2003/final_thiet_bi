// 2. CHI_TIET_THANH_LY.java
package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "chi_tiet_thanh_ly")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder(toBuilder = true)
public class ChiTietPhieuThanhLy {

    @Id

    @Column(name = "ma_cttl")
    private String maCTTL;

    // Liên kết với phiếu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phieu_thanh_ly", nullable = false)
    private PhieuThanhLy phieuThanhLy;

    // Thiết bị bị thanh lý
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tb", nullable = false)
    private ThietBi thietBi;

    // Thông tin kế toán trước thanh lý
    @Column(name = "nguyen_gia", precision = 18, scale = 2)
    private BigDecimal nguyenGia;

    @Column(name = "gia_tri_con_lai", precision = 18, scale = 2)
    private BigDecimal giaTriConLai;

    @Column(name = "so_nam_su_dung")
    private Integer soNamSuDung;

    // Thông tin thanh lý thực tế
    @Column(name = "hinh_thuc_thanh_ly", length = 100, nullable = false)
    private String hinhThucThanhLy;

    @Column(name = "ly_do_thanh_ly", length = 500, nullable = false)
    private String lyDoThanhLy;

    @Column(name = "gia_tri_thu_ve", precision = 18, scale = 2)
    private BigDecimal giaTriThuVe = BigDecimal.ZERO;

    @Column(name = "ngay_thanh_ly")
    private LocalDate ngayThanhLy;

    @Column(name = "ghi_chu", length = 1000)
    private String ghiChu;

    // Người duyệt từng món (nếu cần)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_ng_duyet")
    private NguoiDung nguoiDuyet;
}