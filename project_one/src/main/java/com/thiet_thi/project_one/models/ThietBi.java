package com.thiet_thi.project_one.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "thiet_bi")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ThietBi {

    @Id
    @Column(name = "ma_tb", length = 50)
    private String maTB; // Ví dụ: TB2025001

    // --- CÁC LIÊN KẾT (GIỮ NGUYÊN) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_lo") // Link về Lô để biết nguồn gốc, hóa đơn
    private LoThietBi loThietBi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_loai", nullable = false)
    private LoaiThietBi loaiThietBi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phong") // Vị trí hiện tại
    private Phong phong;

    // --- THÔNG TIN CƠ BẢN ---
    @Column(name = "ten_tb", nullable = false, length = 200)
    private String tenTB;

    // --- THÔNG TIN ĐẶC THÙ (CẦN BỔ SUNG) ---

    // Serial Number của nhà sản xuất (Rất quan trọng với đồ điện tử để bảo hành)
    @Column(name = "so_seri", length = 100)
    private String soSeri;

    // Cấu hình chi tiết (VD: Core i7, RAM 16GB, SSD 512GB)
    // Giúp admin IT biết máy này mạnh hay yếu mà không cần chạy đến xem
    @Column(name = "thong_so_ky_thuat", columnDefinition = "TEXT")
    private String thongSoKyThuat;

    @Column(name = "nam_san_xuat")
    private Integer namSanXuat;

    // --- TRẠNG THÁI & GIÁ TRỊ ---

    // Trạng thái: "Đang sử dụng", "Hỏng", "Bảo trì", "Thanh lý"
    @Column(name = "tinh_trang", nullable = false, length = 50)
    private String tinhTrang;

    // Giá lúc mua (Lấy từ donGia của LoThietBi sang)
    @Column(name = "gia_tri_ban_dau", precision = 18, scale = 2)
    private BigDecimal giaTriBanDau;

    // Giá trị sau khấu hao (Cập nhật sau mỗi kỳ kiểm kê)
    @Column(name = "gia_tri_hien_tai", precision = 18, scale = 2)
    private BigDecimal giaTriHienTai;

    // Ngày bắt đầu đưa vào sử dụng (Thường là ngày biên bản bàn giao)
    @Column(name = "ngay_su_dung")
    private LocalDate ngaySuDung;

    // Ngày cập nhật trạng thái gần nhất (Để theo dõi lịch sử)
    @Column(name = "ngay_cap_nhat")
    private LocalDate ngayCapNhat;
}