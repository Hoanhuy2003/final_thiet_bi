package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.LoTBStatDto;
import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.exceptions.AppException;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.exceptions.ErrorCode;
import com.thiet_thi.project_one.iservices.ILoThietBiService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LoThietBiService implements ILoThietBiService {

    private final LoThietBiRepository loThietBiRepository;
    private final ChiTietDeXuatMuaRepository chiTietRepo;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final ThietBiRepository thietBiRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;
    private final PhongRepository phongRepository;

    // ... (các import và khai báo repository giữ nguyên) ...

    @Override
    public LoThietBi create(LoThietBiDto dto) throws DataNotFoundException {

        NhaCungCap ncc = nhaCungCapRepository.findById(dto.getMaNhaCungCap())
                .orElseThrow(() -> new DataNotFoundException("Chưa chọn nhà cung cấp!"));

        ChiTietDeXuatMua chiTiet = null;
        LoaiThietBi loaiThietBi;
        Phong phongDuKien = null;


        if (dto.getMaCTDX() != null && !dto.getMaCTDX().isEmpty()) {
            chiTiet = chiTietRepo.findById(dto.getMaCTDX())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy chi tiết đề xuất: " + dto.getMaCTDX()));

            // Validate trạng thái & số lượng (Dùng code cũ của bạn)
            String trangThaiDX = chiTiet.getDeXuatMua().getTrangThai();
            if (!"DA_DUYET".equals(trangThaiDX) && !"Đã duyệt".equals(trangThaiDX)) {
                throw new AppException(ErrorCode.PROCUREMENT_NOT_APPROVED);
            }
            int daNhap = loThietBiRepository.sumSoLuongDaNhap(dto.getMaCTDX());
            int xinMua = chiTiet.getSoLuong();
            if (daNhap + dto.getSoLuong() > xinMua) {
                throw new AppException(ErrorCode.IMPORT_EXCEEDS_LIMIT);
            }

            // Lấy thông tin từ đề xuất
            loaiThietBi = chiTiet.getLoaiThietBi();
            phongDuKien = chiTiet.getDeXuatMua().getPhong();

        } else {
            if (dto.getMaLoai() == null || dto.getMaLoai().isEmpty()) {
                throw new IllegalArgumentException("Nhập thủ công phải chọn Loại thiết bị!");
            }
            loaiThietBi = loaiThietBiRepository.findById(dto.getMaLoai()) // Dùng getter mà Frontend gửi (ma_loai)
                    .orElseThrow(() -> new DataNotFoundException("Loại thiết bị không tồn tại"));
            if (dto.getMaPhong() != null && !dto.getMaPhong().isEmpty()) {
                phongDuKien = phongRepository.findById(dto.getMaPhong())
                        .orElseThrow(() -> new DataNotFoundException("Phòng dự kiến không tồn tại!"));
            }

        }

        // 3. TẠO LÔ THIẾT BỊ (Đã sửa chiTiet có thể null)
        String autoMaLo = "LO-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        LoThietBi lo = LoThietBi.builder()
                .maLo(autoMaLo)
                .tenLo(dto.getTenLo())
                .chiTietDeXuatMua(chiTiet) // OKAY: Có thể null
                .loaiThietBi(loaiThietBi)  // OKAY: Đã được gán giá trị ở trên
                .nhaCungCap(ncc)
                .soLuong(dto.getSoLuong())
                .donGia(dto.getDonGia())
                .soHoaDon(dto.getSoHoaDon())
                .ngayHoaDon(dto.getNgayHoaDon())
                .ngayNhap(dto.getNgayNhap() != null ? dto.getNgayNhap() : LocalDate.now())
                .trangThai(1)
                .ghiChu(dto.getGhiChu())
                .build();

        LoThietBi savedLo = loThietBiRepository.save(lo);

        // 4. SINH THIẾT BỊ CON (Sử dụng các biến đã gán)
        // ... (Phần sinh thiết bị con sử dụng loaiThietBi và phongDuKien) ...
        // ... (Giữ nguyên logic bạn đã sửa ở các câu trước) ...
        List<ThietBi> listThietBiMoi = new ArrayList<>();

        // Tạo trạng thái dựa trên việc có phòng hay không
        String trangThaiMacDinh = (phongDuKien != null) ? "Đang sử dụng" : "Sẵn sàng";

        for (int i = 1; i <= savedLo.getSoLuong(); i++) {
            String suffix = String.format("%03d", i);
            String maTB = "TB-" + savedLo.getMaLo() + "-" + suffix;

            ThietBi tb = ThietBi.builder()
                    .maTB(maTB)
                    .tenTB(savedLo.getLoaiThietBi().getTenLoai() + " " + savedLo.getNhaCungCap().getTen() + " " + savedLo.getGhiChu() + " " + suffix)
                    .thongSoKyThuat(savedLo.getGhiChu())
                    .loaiThietBi(savedLo.getLoaiThietBi())
                    .loThietBi(savedLo)
                    .ngaySuDung(savedLo.getNgayNhap())
                    .giaTriBanDau(savedLo.getDonGia())
                    .giaTriHienTai(savedLo.getDonGia())
                    .tinhTrang(trangThaiMacDinh)
                    .phong(phongDuKien) // Gán phòng (có thể null)
                    .build();

            listThietBiMoi.add(tb);
        }
        thietBiRepository.saveAll(listThietBiMoi);

        return savedLo;
    }
    @Override
    public List<LoThietBi> getAll() {
        return loThietBiRepository.findAllByOrderByNgayNhapDesc();
    }

    @Override
    public LoThietBi getByMa(String maLo) throws DataNotFoundException {
        return loThietBiRepository.findById(maLo)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy lô: " + maLo));
    }

    @Override
    public List<LoThietBi> nhapKhoTuDeXuat(String maDeXuat) {
        return loThietBiRepository.findByChiTietDeXuatMua_DeXuatMua_MaDeXuat(maDeXuat);
    }


    @Override
    public LoTBStatDto getStatistics() {
        return loThietBiRepository.getStatistics();
    }
}