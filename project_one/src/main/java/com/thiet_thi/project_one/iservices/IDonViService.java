package com.thiet_thi.project_one.iservices;


import com.thiet_thi.project_one.models.DonVi;

import java.util.List;

public interface IDonViService {
    List<DonVi> getAll();

    DonVi getById(String maDonVi);
}

