package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.ILoThietBiService;
import com.thiet_thi.project_one.models.ChiTietDeXuatMua;
import com.thiet_thi.project_one.models.DeXuatMua;
import com.thiet_thi.project_one.models.LoThietBi;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.thiet_thi.project_one.repositorys.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
public class LoThietBiService implements ILoThietBiService {
    private final LoThietBiRepository loThietBiRepository;
    private final ChiTietDeXuatMuaRepository chiTietRepo;
    private final DeXuatMuaRepository deXuatMuaRepository;

    @Override
    public LoThietBi create(LoThietBiDto dto) throws DataNotFoundException {

        ChiTietDeXuatMua chiTiet = chiTietRepo.findById(dto.getMaCTDX())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy chi tiết đề xuất: " + dto.getMaCTDX()));

        // Kiểm tra đề xuất đã duyệt chưa
        if (!"Đã duyệt".equals(chiTiet.getDeXuatMua().getTrangThai())) {
            throw new IllegalStateException("Chỉ được nhập kho từ đề xuất đã duyệt!");
        }

        LoThietBi lo = LoThietBi.builder()
                .maLo(dto.getMaLo())
                .chiTietDeXuatMua(chiTiet)
                .tenLo(dto.getTenLo())
                .soLuong(dto.getSoLuong())
                .ngayNhap(dto.getNgayNhap() != null ? dto.getNgayNhap() : LocalDate.now())
                .ghiChu(dto.getGhiChu())
                .build();

        return loThietBiRepository.save(lo);
    }

    @Override
    public List<LoThietBi> getAll() {
        return loThietBiRepository.findAll();
    }

    @Override
    public LoThietBi getByMa(String maLo) throws DataNotFoundException {
        return loThietBiRepository.findById(maLo)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy lô thiết bị: " + maLo));
    }

    // BONUS SIÊU HAY: Nhập kho tự động từ đề xuất đã duyệt
    @Override
    public List<LoThietBi> nhapKhoTuDeXuat(String maDeXuat) throws DataNotFoundException {
        DeXuatMua deXuat = deXuatMuaRepository.findById(maDeXuat)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đề xuất"));

        if (!"Đã duyệt".equals(deXuat.getTrangThai())) {
            throw new IllegalStateException("Chỉ nhập kho từ đề xuất đã duyệt!");
        }

        List<LoThietBi> danhSachLo = new ArrayList<>();

        for (ChiTietDeXuatMua ct : deXuat.getChiTietDeXuat()) {
            LoThietBi lo = LoThietBi.builder()
                    .maLo("LO" + ct.getMaCTDX()) // tự sinh mã lô
                    .chiTietDeXuatMua(ct)
                    .tenLo(ct.getLoaiThietBi().getTenLoai())
                    .soLuong(ct.getSoLuong())
                    .ngayNhap(LocalDate.now())
                    .ghiChu("Nhập kho tự động từ đề xuất " + maDeXuat)
                    .build();
            danhSachLo.add(loThietBiRepository.save(lo));
        }

        return danhSachLo;
    }
}
