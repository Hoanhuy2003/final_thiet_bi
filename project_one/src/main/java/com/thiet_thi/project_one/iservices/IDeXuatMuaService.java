// src/main/java/com/thiet_thi/project_one/services/IDeXuatMuaService.java
package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.DeXuatMua;

import java.util.List;

public interface IDeXuatMuaService {

    DeXuatMua create(DeXuatMuaDto dto) throws DataNotFoundException;

    List<DeXuatMua> getAll();

    DeXuatMua getByMa(String ma) throws DataNotFoundException;

    // Bonus: Duyệt đề xuất
    DeXuatMua duyetDeXuat(String maDeXuat, String maNguoiDuyet) throws DataNotFoundException;
}