package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThietBiService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;

import com.thiet_thi.project_one.responses.ThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ThietBiService implements IThietBiService {

    private final ThietBiRepository thietBiRepository;
    private final LoThietBiRepository loThietBiRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;
    private final PhongRepository phongRepository;
    private final LichSuThietBiRepository lichSuThietBiRepository;
    private final  NguoiDungRepository nguoiDungRepository;

    @Override
    public ThietBi createThietBi(ThietBiDto dto) {
        // TỰ ĐỘNG SINH MÃ THIẾT BỊ
        String maTB = generateMaTB(); // ← Hàm mình viết dưới đây

        LoaiThietBi loai = loaiThietBiRepository.findById(dto.getMaLoai())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy loại thiết bị"));

        LoThietBi lo = null;
        if (dto.getMaLo() != null && !dto.getMaLo().isBlank()) {
            lo = loThietBiRepository.findById(dto.getMaLo())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy lô thiết bị"));
        }

        Phong phong = null;
        if (dto.getMaPhong() != null && !dto.getMaPhong().isBlank()) {
            phong = phongRepository.findById(dto.getMaPhong())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng"));
        }

        ThietBi tb = ThietBi.builder()
                .maTB(maTB)  // ← DÙNG HÀM TỰ SINH
                .tenTB(dto.getTenTB())
                .loThietBi(lo)
                .loaiThietBi(loai)
                .phong(phong)
                .tinhTrang(dto.getTinhTrang() != null ? dto.getTinhTrang() : "Đang sử dụng")
                .giaTriBanDau(dto.getGiaTriBanDau())
                .giaTriHienTai(dto.getGiaTriHienTai() != null ? dto.getGiaTriHienTai() : dto.getGiaTriBanDau())
                .ngaySuDung(dto.getNgaySuDung() != null ? dto.getNgaySuDung() : LocalDate.now())
                .soSeri(dto.getSoSeri())
                .thongSoKyThuat(dto.getThongSoKyThuat())
                .build();

        return thietBiRepository.save(tb);
    }

    // HÀM SINH MÃ TỰ ĐỘNG - SIÊU ĐẸP
    private String generateMaTB() {
//        int year = LocalDate.now().getYear();
        long count = thietBiRepository.count();
        return String.format("TB%03d", count + 1);
        // Kết quả: TB-2025-0001, TB-2025-0002,...
    }


    @Override
    public ThietBiResponse getById(String maThietBi) throws DataNotFoundException {
        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị có mã: " + maThietBi));

        List<ThietBiResponse.LichSuHoatDong> lichSu = lichSuThietBiRepository
                .findLichSuByMaTB(maThietBi)
                .stream()
                .map(ls -> {
                    var item = new ThietBiResponse.LichSuHoatDong();

                    item.setNoiDung(
                            ls.getTrangThaiCu() != null && ls.getTrangThaiMoi() != null
                                    ? "Thay đổi trạng thái: " + ls.getTrangThaiCu() + " → " + ls.getTrangThaiMoi()
                                    : "Nhập kho / Cập nhật thông tin"
                    );

                    // CHỈ LẤY NGÀY
                    item.setNgayThayDoi(ls.getNgayThayDoi());

                    item.setNguoiThucHien(
                            ls.getNguoiThayDoi() != null
                                    ? ls.getNguoiThayDoi().getTenND()
                                    : "Hệ thống"
                    );

                    return item;
                })
                .toList();

        return ThietBiResponse.fromThietBiDetail(tb, lichSu);
    }



    @Override
    public Page<ThietBiResponse> getAll(Pageable pageable) {
        Page<ThietBi> thietBiPage = thietBiRepository.findAll(pageable);
        return thietBiPage.map(ThietBiResponse::fromThietBi);
    }
    @Override
    public List<ThietBiResponse> getAllAsList() {

        List<ThietBi> thietBis = thietBiRepository.findAll();
        return thietBis.stream()
                .map(ThietBiResponse::fromThietBi)
                .toList();
    }

    // Triển khai Tìm kiếm/Lọc Nâng cao
    @Override
    public Page<ThietBiResponse> searchAndFilter(
            String search,
            String maLoai,
            String tinhTrang,
            String maPhong,
            Pageable pageable) {

        Page<ThietBi> thietBiPage = thietBiRepository.findByCriteria(
                search,
                maLoai,
                tinhTrang,
                maPhong,
                pageable
        );

        return thietBiPage.map(ThietBiResponse::fromThietBi);
    }

    @Override
    public ThietBi updateThietBi(String maThietBi, ThietBiDto dto) throws DataNotFoundException {

        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị với mã: " + maThietBi));

        // Lưu giá trị cũ
        String phongCu = tb.getPhong() != null ? tb.getPhong().getTenPhong() : null;
        String loaiCu = tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : null;
        String tinhTrangCu = tb.getTinhTrang();

        LoaiThietBi loai = loaiThietBiRepository.findById(dto.getMaLoai())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy loại thiết bị"));


        LoThietBi lo = null;
        if (dto.getMaLo() != null) {
            lo = loThietBiRepository.findById(dto.getMaLo())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy lô thiết bị"));
        }


        Phong phong = null;
        if (dto.getMaPhong() != null) {
            phong = phongRepository.findById(dto.getMaPhong())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng"));
        }

        tb.setTenTB(dto.getTenTB());
        tb.setLoThietBi(lo);
        tb.setLoaiThietBi(loai);
        tb.setPhong(phong);
        tb.setTinhTrang(dto.getTinhTrang());
        tb.setGiaTriBanDau(dto.getGiaTriBanDau());
        tb.setGiaTriHienTai(dto.getGiaTriHienTai());
        tb.setNgaySuDung(dto.getNgaySuDung());
        tb.setSoSeri(dto.getSoSeri());
        tb.setThongSoKyThuat(dto.getThongSoKyThuat());

        String phongMoi = phong != null ? phong.getTenPhong() : null;
        String loaiMoi = loai != null ? loai.getTenLoai() : null;
        String tinhTrangMoi = dto.getTinhTrang();

        // === GHI LỊCH SỬ NẾU CÓ THAY ĐỔI ===
        boolean coThayDoi = false;
        StringBuilder moTa = new StringBuilder();

        if (!Objects.equals(phongCu, phongMoi)) {
            coThayDoi = true;
            moTa.append("Chuyển phòng: ").append(phongCu == null ? "Chưa có" : phongCu)
                    .append(" → ").append(phongMoi == null ? "Chưa có" : phongMoi).append(". ");
        }
        if (!Objects.equals(loaiCu, loaiMoi)) {
            coThayDoi = true;
            moTa.append("Đổi loại: ").append(loaiCu == null ? "Chưa có" : loaiCu)
                    .append(" → ").append(loaiMoi == null ? "Chưa có" : loaiMoi).append(". ");
        }
        if (!Objects.equals(tinhTrangCu, tinhTrangMoi)) {
            coThayDoi = true;
            moTa.append("Trạng thái: ").append(tinhTrangCu).append(" → ").append(tinhTrangMoi).append(". ");
        }

        if (coThayDoi) {
            if (!Objects.equals(phongCu, phongMoi)) {
                LichSuThietBi lichSu = LichSuThietBi.builder()
                        .maLichSu("LS" + System.currentTimeMillis())
                        .thietBi(tb)
//                        .trangThaiCu(tinhTrangCu)
//                        .trangThaiMoi(tinhTrangMoi)
                        .phongCu(phongCu)
                        .phongMoi(phongMoi)
//                        .loaiCu(loaiCu)
//                        .loaiMoi(loaiMoi)
                        .ngayThayDoi(LocalDate.now())
                        .nguoiThayDoi(getCurrentUser())
                        .build();
                lichSuThietBiRepository.save(lichSu);
            }
            else if (!Objects.equals(tinhTrangCu, tinhTrangMoi)) {
                LichSuThietBi lichSu = LichSuThietBi.builder()
                        .maLichSu("LS" + System.currentTimeMillis())
                        .thietBi(tb)
                        .trangThaiCu(tinhTrangCu)
                        .trangThaiMoi(tinhTrangMoi)
//                        .phongCu(phongCu)
//                        .phongMoi(phongMoi)
//                        .loaiCu(loaiCu)
//                        .loaiMoi(loaiMoi)
                        .ngayThayDoi(LocalDate.now())
                        .nguoiThayDoi(getCurrentUser())
                        .build();
                lichSuThietBiRepository.save(lichSu);
            }

        }


        return thietBiRepository.save(tb);
    }

    public NguoiDung getCurrentUser() {
        // Giả sử bạn lấy từ SecurityContext hoặc token
        String maND = "ND001";
        return nguoiDungRepository.findByMaND(maND)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }


    @Override
    public void deleteThietBi(String maThietBi) throws DataNotFoundException {

        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị để xóa"));

        thietBiRepository.delete(tb);
    }
}
