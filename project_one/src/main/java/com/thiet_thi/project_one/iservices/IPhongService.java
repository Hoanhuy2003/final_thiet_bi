package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.PhongDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.Phong;

import java.util.List;

public interface IPhongService {

    Phong createPhong(PhongDto dto) throws DataNotFoundException;
    Phong updatePhong(String maPhong, PhongDto dto) throws DataNotFoundException;
    void deletePhong(String maPhong) throws DataNotFoundException;
    List<Phong> getAllPhong();
    Phong getByMaPhong(String maPhong) throws DataNotFoundException;
}
