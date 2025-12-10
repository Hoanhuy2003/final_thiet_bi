package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.NguoiDungDto;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface INguoiDungService {

    NguoiDungResponse createNguoiDung(NguoiDungDto dto);

    NguoiDungResponse updateNguoiDung(String maNguoiDung, NguoiDungDto dto);

    void deleteNguoiDung(String maNguoiDung);

    NguoiDungResponse getNguoiDungById(String maNguoiDung);

    List<NguoiDungResponse> getAllAsList();

    NguoiDungResponse getMyInfo();

    Page<NguoiDungResponse> searchAndFilter(String search, String vaiTro, String donVi, String trangThai, Pageable pageable);

    // TRONG NguoiDungService (Implementation)
}
