package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.iservices.INhaCungCapService;
import com.thiet_thi.project_one.repositorys.NhaCungCapRepository;
import com.thiet_thi.project_one.responses.NhaCungCapResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NhaCungCapService implements INhaCungCapService {

    private final NhaCungCapRepository nhaCungCapRepository;

    @Override
    public List<NhaCungCapResponse> getAll() {
        return nhaCungCapRepository.findAll()
                .stream()
                .map(NhaCungCapResponse::from) // Convert Entity -> Response
                .toList();
    }
}