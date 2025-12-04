package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.NguoiDungDto;
import com.thiet_thi.project_one.exceptions.AppException;
import com.thiet_thi.project_one.exceptions.ErrorCode;
import com.thiet_thi.project_one.iservices.INguoiDungService;
import com.thiet_thi.project_one.models.DonVi;
import com.thiet_thi.project_one.models.NguoiDung;
import com.thiet_thi.project_one.models.VaiTro;
import com.thiet_thi.project_one.repositorys.DonViRepository;
import com.thiet_thi.project_one.repositorys.NguoiDungRepository;
import com.thiet_thi.project_one.repositorys.VaiTroRepository;
import com.thiet_thi.project_one.responses.NguoiDungResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NguoiDungService implements INguoiDungService {
    DonViRepository donViRepository;

    NguoiDungRepository nguoiDungRepository;
    VaiTroRepository vaiTroRepository;
    PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public NguoiDungResponse createNguoiDung(NguoiDungDto dto) {
        // Kiểm tra trùng tên đăng nhập
        if (nguoiDungRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Encode mật khẩu
        String encodedPassword = passwordEncoder.encode(dto.getMatKhau());

        DonVi dv = donViRepository.findById(dto.getMaDonVi())
                .orElseThrow(() -> new RuntimeException("khong tim thay Don Vi"));

        // Tạo người dùng
        NguoiDung nd = NguoiDung.builder()
                .email(dto.getEmail())
                .matKhau(encodedPassword)
                .tenND(dto.getTenND())
                .trangThai(dto.getTrangThai())
                .soDienThoai(dto.getSoDienThoai())
                .donVi(dv)
                .build();


        if (dto.getMaVaiTro() != null) {
            VaiTro vt = vaiTroRepository.findById(dto.getMaVaiTro())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
            nd.setVaiTro(vt);
        }

        nguoiDungRepository.save(nd);
        return NguoiDungResponse.fromNguoiDung(nd);
    }


    @Override
    public NguoiDungResponse updateNguoiDung(String maNguoiDung, NguoiDungDto dto) {
        NguoiDung nd = nguoiDungRepository.findById(maNguoiDung)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (dto.getTenND() != null) nd.setTenND(dto.getTenND());
        if (dto.getEmail() != null) nd.setEmail(dto.getEmail());
        if (dto.getSoDienThoai() != null) nd.setSoDienThoai(dto.getSoDienThoai());
        if (dto.getTrangThai() != null) nd.setTrangThai(dto.getTrangThai());

        if (dto.getMatKhau() != null && !dto.getMatKhau().isEmpty()) {
            nd.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
        }

        if (dto.getMaVaiTro() != null) {
            VaiTro vt = vaiTroRepository.findById(dto.getMaVaiTro())
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
            nd.setVaiTro(vt);
        }
        if (dto.getMaDonVi() != null && !dto.getMaDonVi().isEmpty()) {
            DonVi dv = donViRepository.findById(dto.getMaDonVi())
                    .orElseThrow(() -> new RuntimeException("Đơn vị không tồn tại"));
            nd.setDonVi(dv);
        }


        nguoiDungRepository.save(nd);
        return NguoiDungResponse.fromNguoiDung(nd);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteNguoiDung(String maNguoiDung) {
        NguoiDung nd = nguoiDungRepository.findById(maNguoiDung)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        nguoiDungRepository.delete(nd);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public NguoiDungResponse getNguoiDungById(String maNguoiDung) {
        NguoiDung nd = nguoiDungRepository.findById(maNguoiDung)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return NguoiDungResponse.fromNguoiDung(nd);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<NguoiDungResponse> getAllNguoiDung(Pageable pageable) {
        return nguoiDungRepository.findAll(pageable)
                .map(NguoiDungResponse::fromNguoiDung);
    }
    @Override
    public NguoiDungResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        NguoiDung nd = nguoiDungRepository.findByEmail(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return NguoiDungResponse.fromNguoiDung(nd);
    }
}
