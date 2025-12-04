package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.models.DonVi;

import java.util.List;

public interface IDonViService {

    // Lấy tất cả đơn vị
    List<DonVi> getAll();

    // Lấy đơn vị theo mã
    DonVi getById(String maDonVi);
}
