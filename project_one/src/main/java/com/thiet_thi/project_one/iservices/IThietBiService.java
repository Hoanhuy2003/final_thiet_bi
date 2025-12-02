package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.ThietBi;
import com.thiet_thi.project_one.responses.ThietBiResponse;

import java.util.List;

public interface IThietBiService {
    ThietBi createThietBi(ThietBiDto thietBiDto);
    ThietBiResponse getById(String maThietBi) throws DataNotFoundException;
    List<ThietBi> getAll();
    ThietBi updateThietBi(String maThietBi, ThietBiDto thietBiDto) throws DataNotFoundException;
    void deleteThietBi(String maThietBi) throws DataNotFoundException;
}
