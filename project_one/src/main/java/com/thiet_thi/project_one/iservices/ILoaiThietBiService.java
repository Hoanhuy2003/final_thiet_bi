package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.responses.LoaiThietBiResponse;

import java.util.List;

public interface ILoaiThietBiService {
    List<LoaiThietBiResponse> getAll();
    LoaiThietBiResponse getById(String maLoai);
}
