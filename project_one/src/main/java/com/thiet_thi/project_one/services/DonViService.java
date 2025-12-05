// src/main/java/com/thiet_thi/project_one/services/impl/DonViService.java
package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.DonViDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.models.Phong;
import com.thiet_thi.project_one.models.NguoiDung;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import com.thiet_thi.project_one.repositorys.PhongRepository;
import com.thiet_thi.project_one.repositorys.NguoiDungRepository;
import com.thiet_thi.project_one.iservices.IDonViService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonViService implements IDonViService {

    private final DonViRepository donViRepository;
    private final PhongRepository phongRepository;
    private final NguoiDungRepository nguoiDungRepository;
    @Override
    @Transactional
    public DonVi createDonVi(DonViDto dto) throws DataNotFoundException {
        if (donViRepository.existsById(dto.getMaDonVi())) {
            throw new IllegalArgumentException("Mã đơn vị đã tồn tại!");
        }

        DonVi donVi = DonVi.builder()
                .maDonVi(dto.getMaDonVi())
                .tenDonVi(dto.getTenDonVi())
                .build();

        return donViRepository.save(donVi);
    }

    @Override
    @Transactional
    public DonVi updateDonVi(String maDonVi, DonViDto dto) throws DataNotFoundException {
        DonVi donVi = donViRepository.findById(maDonVi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn vị: " + maDonVi));

        donVi.setTenDonVi(dto.getTenDonVi());

        return donViRepository.save(donVi);
    }

    @Override
    @Transactional
    public void deleteDonVi(String maDonVi) throws DataNotFoundException {

        DonVi donVi = getByMaDV(maDonVi);

        if (!donVi.getDsPhong().isEmpty()) {
            throw new IllegalStateException("Không thể xóa đơn vị đang có phòng!");
        }
        if (!donVi.getDsNguoiDung().isEmpty()) {
            throw new IllegalStateException("Không thể xóa đơn vị đang có người dùng!");
        }

        donViRepository.delete(donVi);
    }

    // GET ALL
    @Override
    public List<DonVi> getAllDonVi() {
        return donViRepository.findAll();
    }

    // GET BY MA
    @Override
    public DonVi getByMaDV(String maDonVi) throws DataNotFoundException {
        return donViRepository.findById(maDonVi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đơn vị: " + maDonVi));
    }
}