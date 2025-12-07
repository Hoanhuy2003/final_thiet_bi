package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.ILoThietBiService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LoThietBiService implements ILoThietBiService {

    private final LoThietBiRepository loThietBiRepository;
    private final ChiTietDeXuatMuaRepository chiTietRepo;
    private final NhaCungCapRepository nhaCungCapRepository;

    @Override
    public LoThietBi create(LoThietBiDto dto) throws DataNotFoundException {

        // 1. Tìm Chi Tiết Đề Xuất
        ChiTietDeXuatMua chiTiet = chiTietRepo.findById(dto.getMaCTDX())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy chi tiết: " + dto.getMaCTDX()));

        // 2. Kiểm tra trạng thái Đề Xuất
        String trangThaiDX = chiTiet.getDeXuatMua().getTrangThai();
        if (!"DA_DUYET".equals(trangThaiDX) && !"Đã duyệt".equals(trangThaiDX)) {
            throw new IllegalStateException("Đề xuất chưa được duyệt, không thể nhập kho!");
        }

        // 3. Tìm Nhà Cung Cấp
        NhaCungCap ncc = nhaCungCapRepository.findById(dto.getMaNhaCungCap())
                .orElseThrow(() -> new DataNotFoundException("Chưa chọn nhà cung cấp!"));



        // Gọi DB tính xem chi tiết này đã nhập bao nhiêu rồi
        int daNhap = loThietBiRepository.sumSoLuongDaNhap(dto.getMaCTDX());

        int xinMua = chiTiet.getSoLuong();
        int nhapMoi = dto.getSoLuong();

        // Chặn nhập quá số lượng
        if (daNhap + nhapMoi > xinMua) {
            throw new IllegalStateException("Nhập quá số lượng đề xuất! (Đã nhập: " + daNhap + "/" + xinMua + ")");
        }


        // 4. Tạo Lô
        LoThietBi lo = LoThietBi.builder()
                .maLo(dto.getMaLo())
                .tenLo(dto.getTenLo())
                .chiTietDeXuatMua(chiTiet)
                .loaiThietBi(chiTiet.getLoaiThietBi())
                .nhaCungCap(ncc)
                .soLuong(nhapMoi)
                .donGia(dto.getDonGia())
                .soHoaDon(dto.getSoHoaDon())
                .ngayHoaDon(dto.getNgayHoaDon())
                .ngayNhap(dto.getNgayNhap() != null ? dto.getNgayNhap() : LocalDate.now())
                .trangThai(0)
                .ghiChu(dto.getGhiChu())
                .build();

        return loThietBiRepository.save(lo);
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
    public List<LoThietBi> nhapKhoTuDeXuat(String maDeXuat) throws DataNotFoundException {
        return loThietBiRepository.findByChiTietDeXuatMua_DeXuatMua_MaDeXuat(maDeXuat);
    }
}