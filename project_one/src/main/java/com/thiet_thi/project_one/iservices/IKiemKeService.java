package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.ChiTietKiemKe;
import com.thiet_thi.project_one.models.KiemKe;

import java.util.List;

public interface IKiemKeService {
    List<KiemKe> getAll();
    KiemKe getById(String maKK) throws DataNotFoundException;
    List<ChiTietKiemKe> getAllChiTiet();
    KiemKe create(KiemKeDto phieuKiemKe) throws DataNotFoundException;
    KiemKe update(String maKK, KiemKeDto phieuKiemKe) throws  DataNotFoundException;

}
