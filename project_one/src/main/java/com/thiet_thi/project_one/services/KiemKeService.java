// src/main/java/com/thiet_thi/project_one/services/KiemKeServiceImpl.java
package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IKiemKeService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KiemKeService implements IKiemKeService {

    private final KiemKeRepository kiemKeRepository;
    private final ChiTietKiemKeRepository chiTietKiemKeRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ThietBiRepository thietBiRepository;

    @Override
    public List<KiemKe> getAll() {
        return kiemKeRepository.findAll();
    }

    @Override
    public KiemKe getById(String maKK) throws DataNotFoundException {
        return kiemKeRepository.findById(maKK)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phiếu kiểm kê: " + maKK));
    }

    @Override
    public List<ChiTietKiemKe> getAllChiTiet() {
        return chiTietKiemKeRepository.findAll();
    }

    @Override
    @Transactional
    public KiemKe create(KiemKeDto dto) throws DataNotFoundException {
        NguoiDung nd = nguoiDungRepository.findById(dto.getMaND())
                .orElseThrow(() -> new DataNotFoundException("Người dùng không tồn tại"));

        KiemKe kiemKe = KiemKe.builder()
                .maKiemKe(dto.getMaKiemKe())
                .nguoiKiemKe(nd)
                .ngayKiemKe(dto.getNgayKiemKe())
                .ghiChu(dto.getGhiChu())
                .build();

        // Thêm chi tiết
        for (var ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Thiết bị không tồn tại: " + ctDto.getMaTB()));

            ChiTietKiemKe ct = ChiTietKiemKe.builder()
                    .maCTKK(ctDto.getMaCTKK())
                    .kiemKe(kiemKe)
                    .thietBi(tb)
                    .tinhTrangThucTe(ctDto.getTinhTrangThucTe())
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            kiemKe.getChiTiet().add(ct);
        }

        return kiemKeRepository.save(kiemKe);
    }

    @Override
    @Transactional
    public KiemKe update(String maKK, KiemKeDto dto) throws DataNotFoundException {
        KiemKe kiemKe = getById(maKK);

        NguoiDung nd = nguoiDungRepository.findById(dto.getMaND())
                .orElseThrow(() -> new DataNotFoundException("Người dùng không tồn tại"));

        // Cập nhật thông tin phiếu
        kiemKe.setNguoiKiemKe(nd);
        kiemKe.setNgayKiemKe(dto.getNgayKiemKe());
        kiemKe.setGhiChu(dto.getGhiChu());

        // Xóa chi tiết cũ
        chiTietKiemKeRepository.deleteAll(kiemKe.getChiTiet());
        kiemKe.getChiTiet().clear();

        // Thêm chi tiết mới
        for (var ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Thiết bị không tồn tại: " + ctDto.getMaTB()));

            ChiTietKiemKe ct = ChiTietKiemKe.builder()
                    .maCTKK(ctDto.getMaCTKK())
                    .kiemKe(kiemKe)
                    .thietBi(tb)
                    .tinhTrangThucTe(ctDto.getTinhTrangThucTe())
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            kiemKe.getChiTiet().add(ct);
        }

        return kiemKeRepository.save(kiemKe);
    }
}