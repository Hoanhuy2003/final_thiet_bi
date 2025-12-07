package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LoThietBiResponse {

    private String maLo;
    private String tenLo;
    private Integer soLuong;

    // --- THÊM GIÁ (Frontend cần hiển thị) ---
    private BigDecimal donGia;
    private BigDecimal tongTien; // Field này tính toán (soLuong * donGia)

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayNhap;

    // --- THÊM CHỨNG TỪ & TRẠNG THÁI ---
    private String soHoaDon;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayHoaDon;

    private Integer trangThai; // 0: Mới, 1: Đã nhập TS

    private String ghiChu;

    // --- THÔNG TIN LIÊN KẾT ---

    // 1. Từ Đề xuất
    private String maDeXuat;
    private String tieuDeDeXuat;

    // 2. Từ Loại thiết bị
    private String maLoai;
    private String tenLoai;

    // 3. Từ Nhà cung cấp (Mới thêm)
    private String maNhaCungCap;
    private String tenNhaCungCap;

    public static LoThietBiResponse from(LoThietBi lo) {
        // Lấy các object liên quan để null check
        ChiTietDeXuatMua ct = lo.getChiTietDeXuatMua();
        DeXuatMua dx = ct != null ? ct.getDeXuatMua() : null;
        LoaiThietBi loai = lo.getLoaiThietBi(); // Lấy trực tiếp từ Lô (chuẩn hơn lấy từ CTDX)
        NhaCungCap ncc = lo.getNhaCungCap();

        // Tính tổng tiền để trả về cho FE hiển thị
        BigDecimal total = BigDecimal.ZERO;
        if (lo.getDonGia() != null && lo.getSoLuong() != null) {
            total = lo.getDonGia().multiply(BigDecimal.valueOf(lo.getSoLuong()));
        }

        return LoThietBiResponse.builder()
                .maLo(lo.getMaLo())
                .tenLo(lo.getTenLo())
                .soLuong(lo.getSoLuong())
                .donGia(lo.getDonGia())
                .tongTien(total) // <--- Trả về giá trị tính toán
                .ngayNhap(lo.getNgayNhap())
                .soHoaDon(lo.getSoHoaDon())
                .ngayHoaDon(lo.getNgayHoaDon())
                .trangThai(lo.getTrangThai())
                .ghiChu(lo.getGhiChu())

                // Map Đề xuất
                .maDeXuat(dx != null ? dx.getMaDeXuat() : null)
                .tieuDeDeXuat(dx != null ? dx.getTieuDe() : null)

                // Map Loại
                .maLoai(loai != null ? loai.getMaLoai() : null)
                .tenLoai(loai != null ? loai.getTenLoai() : null)

                // Map Nhà cung cấp
                .maNhaCungCap(ncc != null ? ncc.getMaNhaCungCap() : null)
                .tenNhaCungCap(ncc != null ? ncc.getTen() : "N/A")
                .build();
    }
}