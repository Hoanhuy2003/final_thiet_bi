package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.PhieuThanhLyDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.PhieuThanhLy;

import java.util.List;

public interface IThanhLyService {
    PhieuThanhLy create(PhieuThanhLyDto dto);
    List<PhieuThanhLy> getAll();
    PhieuThanhLy getByID(String maTL) throws DataNotFoundException;
    void delete(String maPhieu) throws DataNotFoundException;
    PhieuThanhLy update(String maPhieu, PhieuThanhLyDto dto) throws DataNotFoundException;
    // MỚI: Duyệt phiếu thanh lý
    PhieuThanhLy duyetPhieu(String maPhieu, String maNguoiDuyet) throws DataNotFoundException;

    // MỚI: Từ chối phiếu thanh lý
    PhieuThanhLy tuChoiPhieu(String maPhieu, String maNguoiDuyet, String lyDoTuChoi) throws DataNotFoundException;
}
