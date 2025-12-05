package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.VaiTroDto;
import com.thiet_thi.project_one.exceptions.AppException;
import com.thiet_thi.project_one.exceptions.ErrorCode;
import com.thiet_thi.project_one.iservices.IVaiTroService;
import com.thiet_thi.project_one.models.VaiTro;
import com.thiet_thi.project_one.repositorys.VaiTroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VaiTroService implements IVaiTroService {

    private final VaiTroRepository vaiTroRepository;

    @Override
    public List<VaiTroDto> getAllRoles() {
        return vaiTroRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VaiTroDto getRoleByMaVaiTro(String maVaiTro) {
        VaiTro role = vaiTroRepository.findByMaVaiTro(maVaiTro)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
        return toDTO(role);
    }

    @Override
    public VaiTroDto createRole(VaiTroDto dto) {
        if(vaiTroRepository.existsById(dto.getMaVaiTro())) {
            throw new  AppException(ErrorCode.ROLE_EXISTED);
        }

        VaiTro role = VaiTro.builder()
                .maVaiTro(dto.getMaVaiTro())
                .tenVaiTro(dto.getTenVaiTro())
                .build();
        System.out.println("MA VAI TRO TRƯỚC SAVE: " + role.getMaVaiTro());
        role = vaiTroRepository.save(role);
        return toDTO(role);
    }

    @Override
    public VaiTroDto updateRole(String maVaiTro, VaiTroDto dto) {
        VaiTro role = vaiTroRepository.findByMaVaiTro(maVaiTro)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        role.setTenVaiTro(dto.getTenVaiTro());
        role = vaiTroRepository.save(role);
        return toDTO(role);
    }

    @Override
    public void deleteRole(String maVaiTro) {
        vaiTroRepository.deleteById(maVaiTro);
    }

    private VaiTroDto toDTO(VaiTro role) {
        return VaiTroDto.builder()
                .maVaiTro(role.getMaVaiTro())
                .tenVaiTro(role.getTenVaiTro())
                .build();
    }
}
