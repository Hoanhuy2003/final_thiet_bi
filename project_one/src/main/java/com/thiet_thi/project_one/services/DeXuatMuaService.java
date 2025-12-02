package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ChiTietDeXuatMuaDto;
import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IDeXuatMuaService;
import com.thiet_thi.project_one.models.ChiTietDeXuatMua;
import com.thiet_thi.project_one.models.DeXuatMua;
import com.thiet_thi.project_one.models.LoaiThietBi;
import com.thiet_thi.project_one.models.NguoiDung;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.thiet_thi.project_one.repositorys.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeXuatMuaService implements IDeXuatMuaService {
    private final DeXuatMuaRepository deXuatMuaRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;

    @Override
    @Transactional
    public DeXuatMua create(DeXuatMuaDto dto) throws DataNotFoundException {

        NguoiDung nguoiTao = nguoiDungRepository.findById(dto.getMaND())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người tạo"));

        DeXuatMua deXuat = DeXuatMua.builder()
                .maDeXuat(dto.getMaDeXuat())
                .tieuDe(dto.getTieuDe())
                .noiDung(dto.getNoiDung())
                .ngayTao(dto.getNgayTao() != null ? dto.getNgayTao() : LocalDate.now())
                .trangThai("Chờ duyệt")
                .nguoiTao(nguoiTao)
                .build();

        for (ChiTietDeXuatMuaDto ctDto : dto.getChiTiet()) {
            LoaiThietBi loai = loaiThietBiRepository.findById(ctDto.getMaLoai())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy loại thiết bị: " + ctDto.getMaLoai()));

            ChiTietDeXuatMua chiTiet = ChiTietDeXuatMua.builder()
                    .maCTDX(ctDto.getMaCTDX())
                    .deXuatMua(deXuat)
                    .loaiThietBi(loai)
                    .soLuong(ctDto.getSoLuong())
                    .donGia(ctDto.getDonGia())
                    .build();

            deXuat.getChiTietDeXuat().add(chiTiet);
        }

        return deXuatMuaRepository.save(deXuat);
    }

    @Override
    public List<DeXuatMua> getAll() {
        return deXuatMuaRepository.findAll();
    }

    @Override
    public DeXuatMua getByMa(String ma) throws DataNotFoundException {
        return deXuatMuaRepository.findById(ma)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đề xuất: " + ma));
    }

    @Override
    @Transactional
    public DeXuatMua duyetDeXuat(String maDeXuat, String maNguoiDuyet) throws DataNotFoundException {
        DeXuatMua deXuat = getByMa(maDeXuat);
        NguoiDung nguoiDuyet = nguoiDungRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người duyệt"));

        deXuat.setTrangThai("Đã duyệt");
        deXuat.setNguoiTao(nguoiDuyet);
        deXuat.setNgayTao(LocalDate.now());

        return deXuatMuaRepository.save(deXuat);
    }
}
