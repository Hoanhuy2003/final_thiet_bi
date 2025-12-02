package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.PhieuThanhLyDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.PhieuThanhLy;

import java.util.List;

public interface IThanhLyService {
    PhieuThanhLy create(PhieuThanhLyDto dto);
    List<PhieuThanhLy> getAll();
    PhieuThanhLy getByID(String maTL) throws DataNotFoundException;
}
