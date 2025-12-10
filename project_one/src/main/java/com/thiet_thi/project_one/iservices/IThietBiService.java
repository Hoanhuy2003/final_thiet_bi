package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.ThietBi;
import com.thiet_thi.project_one.responses.ThietBiResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IThietBiService {

    ThietBi createThietBi(ThietBiDto thietBiDto);

    ThietBiResponse getById(String maThietBi) throws DataNotFoundException;

    Page<ThietBiResponse> getAll(Pageable pageable);
    List<ThietBiResponse> getAllAsList();
    ThietBi updateThietBi(String maThietBi, ThietBiDto thietBiDto) throws DataNotFoundException;

    void deleteThietBi(String maThietBi) throws DataNotFoundException;

    Page<ThietBiResponse> searchAndFilter(
            String search,
            String maLoai,
            String tinhTrang,
            String maPhong,
            Pageable pageable);


}