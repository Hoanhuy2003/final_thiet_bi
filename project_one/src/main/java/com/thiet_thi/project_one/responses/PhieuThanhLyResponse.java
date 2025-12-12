// src/main/java/com/thiet_thi/project_one/responses/PhieuThanhLyResponse.java
package com.thiet_thi.project_one.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.thiet_thi.project_one.models.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhieuThanhLyResponse {

    private String maPhieuThanhLy;
    private String soPhieu;
    private String hinhThuc;
    private String lyDoThanhLy;
    private String ghiChu;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayLap;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayThanhLy;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayDuyet;

    private String trangThai;

    private String maNguoiTao;
    private String tenNguoiTao;

    private String maNguoiDuyet;
    private String tenNguoiDuyet;

    private Integer tongThietBi;
    private BigDecimal tongGiaTriThuVe;

    private List<ChiTietResponse> chiTiet;

    // ================= CHI TIẾT THANH LÝ – ĐÃ THÊM TRẠNG THÁI & NGƯỜI DUYỆT =================
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChiTietResponse {
        private String maCttl;
        private String maTb;
        private String tenTb;
        private String maLoai;
        private String tenLoai;
        private String maPhong;
        private String tenPhong;
        private String tinhTrang; // Trạng thái thiết bị
        private String soSeri;

        // THÊM: Trạng thái duyệt từng món
        private String trangThai; // "Chờ duyệt", "Duyệt", "Từ chối"

        private BigDecimal nguyenGia;
        private BigDecimal giaTriConLai;
        private Integer soNamSuDung;

        private String hinhThucThanhLy;
        private String lyDoThanhLy;
        private BigDecimal giaTriThuVe;

        @JsonFormat(pattern = "dd/MM/yyyy")
        private LocalDate ngayThanhLy;

        private String ghiChu;

        // Người duyệt từng món (có thể null nếu từ chối)
        private String maNguoiDuyet;
        private String tenNguoiDuyet;
    }

    // ================= HÀM CHUYỂN ĐỔI SIÊU CHUẨN =================
    public static PhieuThanhLyResponse from(PhieuThanhLy phieu) {

        // Tính tổng giá trị thu về
        BigDecimal tongThuVe = phieu.getChiTiet().stream()
                .map(ChiTietPhieuThanhLy::getGiaTriThuVe)
                .filter(g -> g != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Map danh sách chi tiết – ĐÃ THÊM TRẠNG THÁI & NGƯỜI DUYỆT
        List<ChiTietResponse> chiTietList = phieu.getChiTiet().stream()
                .map(ct -> {
                    ThietBi tb = ct.getThietBi();
                    LoaiThietBi loai = tb.getLoaiThietBi();
                    Phong phong = tb.getPhong();
                    NguoiDung nguoiDuyetChiTiet = ct.getNguoiDuyet();

                    return ChiTietResponse.builder()
                            .maCttl(ct.getMaCTTL())
                            .maTb(tb.getMaTB())
                            .tenTb(tb.getTenTB())
                            .maLoai(loai != null ? loai.getMaLoai() : null)
                            .tenLoai(loai != null ? loai.getTenLoai() : null)
                            .maPhong(phong != null ? phong.getMaPhong() : null)
                            .tenPhong(phong != null ? phong.getTenPhong() : null)
                            .tinhTrang(tb.getTinhTrang())
                            .trangThai(ct.getTrangThai() != null ? ct.getTrangThai() : "Chờ duyệt") // THÊM TRẠNG THÁI
                            .nguyenGia(tb.getGiaTriBanDau())
                            .giaTriConLai(tb.getGiaTriHienTai())
                            .soNamSuDung(ct.getSoNamSuDung())
                            .hinhThucThanhLy(ct.getHinhThucThanhLy())
                            .lyDoThanhLy(ct.getLyDoThanhLy())
                            .giaTriThuVe(ct.getGiaTriThuVe())
                            .ngayThanhLy(ct.getNgayThanhLy())
                            .ghiChu(ct.getGhiChu())
                            .maNguoiDuyet(nguoiDuyetChiTiet != null ? nguoiDuyetChiTiet.getMaND() : null)
                            .tenNguoiDuyet(nguoiDuyetChiTiet != null ? nguoiDuyetChiTiet.getTenND() : null)
                            .soSeri(tb.getSoSeri())
                            .build();
                })
                .collect(Collectors.toList());

        return PhieuThanhLyResponse.builder()
                .maPhieuThanhLy(phieu.getMaPhieuThanhLy())
                .soPhieu(phieu.getSoPhieu())
                .hinhThuc(phieu.getHinhThuc())
                .lyDoThanhLy(phieu.getLyDoThanhLy())
                .ghiChu(phieu.getGhiChu())
                .ngayLap(phieu.getNgayLap())
                .ngayThanhLy(phieu.getNgayThanhLy())
                .ngayDuyet(phieu.getNgayDuyet())
                .trangThai(phieu.getTrangThai())
                .maNguoiTao(phieu.getNguoiLap() != null ? phieu.getNguoiLap().getMaND() : null)
                .tenNguoiTao(phieu.getNguoiLap() != null ? phieu.getNguoiLap().getTenND() : null)
                .maNguoiDuyet(phieu.getNguoiDuyet() != null ? phieu.getNguoiDuyet().getMaND() : null)
                .tenNguoiDuyet(phieu.getNguoiDuyet() != null ? phieu.getNguoiDuyet().getTenND() : null)
                .tongThietBi(chiTietList.size())
                .tongGiaTriThuVe(tongThuVe)
                .chiTiet(chiTietList)
                .build();
    }
}