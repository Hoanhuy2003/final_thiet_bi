package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.NguoiDungDto;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface INguoiDungService {

    NguoiDungResponse createNguoiDung(NguoiDungDto dto);

    NguoiDungResponse updateNguoiDung(String maNguoiDung, NguoiDungDto dto);

    void deleteNguoiDung(String maNguoiDung);

    NguoiDungResponse getNguoiDungById(String maNguoiDung);

    Page<NguoiDungResponse> getAllNguoiDung(Pageable pageable);

    NguoiDungResponse getMyInfo();
}
