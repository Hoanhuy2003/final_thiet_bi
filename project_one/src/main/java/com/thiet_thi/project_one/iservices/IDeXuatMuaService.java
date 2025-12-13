package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.responses.DeXuatMuaResponse;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IDeXuatMuaService {
    DeXuatMuaResponse create(DeXuatMuaDto dto) throws DataNotFoundException;

    // Lấy tất cả (Admin/Hiệu trưởng xem)
    List<DeXuatMuaResponse> getAll();


    DeXuatMuaResponse getById(String id) throws DataNotFoundException;


    List<DeXuatMuaResponse> getMyProposals(String maNguoiDung);

    DeXuatMuaResponse approve(String maDeXuat, String maNguoiDuyet) throws DataNotFoundException;

    DeXuatMuaResponse reject(String maDeXuat, String maNguoiDuyet, String lyDo) throws DataNotFoundException;

    Page<DeXuatMuaResponse> getAllPage(Pageable pageable);

    // HÀM MỚI: Tìm kiếm và Lọc Nâng cao
    Page<DeXuatMuaResponse> searchAndFilter(
            String search,
            String trangThai,
            String tieuDe,
            Pageable pageable);
}
