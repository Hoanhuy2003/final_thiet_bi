// src/main/java/com/thiet_thi/project_one/services/IBaoCaoService.java
package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.BaoCaoDto;
import com.thiet_thi.project_one.models.BaoCao;

import java.util.List;

public interface IBaoCaoService {
    BaoCao taoBaoCao(BaoCaoDto dto);
    List<BaoCao> getAll();
}