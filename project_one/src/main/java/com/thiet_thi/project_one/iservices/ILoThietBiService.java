package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.LoTBStatDto;
import com.thiet_thi.project_one.dtos.LoThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.LoThietBi;

import java.util.List;

public interface ILoThietBiService {


    LoThietBi create(LoThietBiDto dto) throws DataNotFoundException;


    List<LoThietBi> getAll();


    LoThietBi getByMa(String maLo) throws DataNotFoundException;


    List<LoThietBi> nhapKhoTuDeXuat(String maDeXuat) throws DataNotFoundException;
    LoTBStatDto getStatistics();
}