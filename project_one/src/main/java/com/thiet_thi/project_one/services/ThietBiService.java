package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThietBiService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;

import com.thiet_thi.project_one.responses.ThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThietBiService implements IThietBiService {

    private final ThietBiRepository thietBiRepository;
    private final LoThietBiRepository loThietBiRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;
    private final PhongRepository phongRepository;
    private final LichSuThietBiRepository lichSuThietBiRepository;

    @Override
    public ThietBi createThietBi(ThietBiDto dto) {

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

        ThietBi tb = ThietBi.builder()
                .maTB(dto.getMaTB())
                .tenTB(dto.getTenTB())
                .loThietBi(lo)
                .loaiThietBi(loai)
                .phong(phong)
                .tinhTrang(dto.getTinhTrang())
                .giaTriBanDau(dto.getGiaTriBanDau())
                .giaTriHienTai(dto.getGiaTriHienTai())
                .ngaySuDung(dto.getNgaySuDung())
                .build();

        return thietBiRepository.save(tb);
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
    public List<ThietBi> getAll() {
        return thietBiRepository.findAll();
    }

    @Override
    public ThietBi updateThietBi(String maThietBi, ThietBiDto dto) throws DataNotFoundException {

        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị với mã: " + maThietBi));


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

        return thietBiRepository.save(tb);
    }


    @Override
    public void deleteThietBi(String maThietBi) throws DataNotFoundException {

        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị để xóa"));

        thietBiRepository.delete(tb);
    }
}
