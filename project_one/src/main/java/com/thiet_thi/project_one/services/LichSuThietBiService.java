// src/main/java/com/thiet_thi/project_one/services/impl/LichSuThietBiService.java
package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.iservices.ILichSuThietBiService;
import com.thiet_thi.project_one.models.LichSuThietBi;
import com.thiet_thi.project_one.repositorys.LichSuThietBiRepository;
import com.thiet_thi.project_one.responses.LichSuThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LichSuThietBiService implements ILichSuThietBiService {

    private final LichSuThietBiRepository lichSuThietBiRepository;

    @Override
    public List<LichSuThietBiResponse> getLichSuByMaTB(String maTB) {
        List<LichSuThietBi> list = lichSuThietBiRepository.findLichSuByMaTB(maTB);
        return list.stream()
                .map(LichSuThietBiResponse::fromLichSu)
                .collect(Collectors.toList());
    }
}