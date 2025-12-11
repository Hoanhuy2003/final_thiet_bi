// src/main/java/com/thiet_thi/project_one/iservices/ILichSuThietBiService.java
package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.responses.LichSuThietBiResponse;

import java.util.List;

public interface ILichSuThietBiService {
    List<LichSuThietBiResponse> getLichSuByMaTB(String maTB);
}