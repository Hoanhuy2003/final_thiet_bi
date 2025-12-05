package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.DonViDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.DonVi;

import java.util.List;

public interface IDonViService {


    DonVi createDonVi(DonViDto dto) throws DataNotFoundException;
    DonVi updateDonVi(String maDonVi, DonViDto dto) throws DataNotFoundException;
    void deleteDonVi(String maDonVi) throws DataNotFoundException;
    List<DonVi> getAllDonVi();
    DonVi getByMaDV(String maDonVi) throws DataNotFoundException;
}
