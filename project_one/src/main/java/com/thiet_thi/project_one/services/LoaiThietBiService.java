package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.iservices.ILoaiThietBiService;
import com.thiet_thi.project_one.models.LoaiThietBi;
import com.thiet_thi.project_one.repositorys.LoaiThietBiRepository;
import com.thiet_thi.project_one.responses.LoaiThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoaiThietBiService implements ILoaiThietBiService {

    private final LoaiThietBiRepository repo;

    private LoaiThietBiResponse map(LoaiThietBi x) {
        return LoaiThietBiResponse.builder()
                .maLoai(x.getMaLoai())
                .tenLoai(x.getTenLoai())
                .thoiGianKhauHao(x.getThoiGianKhauHao())
                .tiLeKhauHao(x.getTiLeKhauHao())
                .build();
    }

    @Override
    public List<LoaiThietBiResponse> getAll() {
        return repo.findAll().stream()
                .map(this::map)
                .toList();
    }

    @Override
    public LoaiThietBiResponse getById(String id) {
        LoaiThietBi entity = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại thiết bị"));
        return map(entity);
    }
}

