package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ChiTietDeXuatMuaDto;
import com.thiet_thi.project_one.dtos.DeXuatMuaDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IDeXuatMuaService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import com.thiet_thi.project_one.responses.DeXuatMuaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeXuatMuaService implements IDeXuatMuaService {

    private final DeXuatMuaRepository deXuatMuaRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;

    @Override
    public DeXuatMuaResponse create(DeXuatMuaDto dto) throws DataNotFoundException {
        // 1. Tìm người tạo
        NguoiDung nguoiTao = nguoiDungRepository.findById(dto.getMaND())
                .orElseThrow(() -> new DataNotFoundException("Người dùng không tồn tại"));

        // 2. Tạo Entity cha (DeXuatMua)
        DeXuatMua deXuat = DeXuatMua.builder()
                .maDeXuat(dto.getMaDeXuat() != null ? dto.getMaDeXuat() : "DX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .tieuDe(dto.getTieuDe())
                .noiDung(dto.getNoiDung())
                .ngayTao(LocalDate.now())
                .trangThai("Chờ duyệt") // Mặc định
                .nguoiTao(nguoiTao)

                .build();

        // 3. Xử lý danh sách chi tiết (Quan trọng)
        if (dto.getChiTiet() != null) {
            for (ChiTietDeXuatMuaDto ctDto : dto.getChiTiet()) {
                LoaiThietBi loai = loaiThietBiRepository.findById(ctDto.getMaLoai())
                        .orElseThrow(() -> new DataNotFoundException("Loại thiết bị không tồn tại: " + ctDto.getMaLoai()));

                ChiTietDeXuatMua ctEntity = ChiTietDeXuatMua.builder()
                        .maCTDX("CT-" + UUID.randomUUID().toString().substring(0, 8))
                        .deXuatMua(deXuat) // Link ngược lại cha
                        .loaiThietBi(loai)
                        .soLuong(ctDto.getSoLuong())
                        .donGia(ctDto.getDonGia())
                        .build();

                // Add vào Set của cha
                deXuat.getChiTietDeXuat().add(ctEntity);
            }
        }

        // 4. Lưu (Cascade sẽ tự lưu các chi tiết con)
        DeXuatMua saved = deXuatMuaRepository.save(deXuat);
        return DeXuatMuaResponse.from(saved);
    }

    @Override
    public List<DeXuatMuaResponse> getAll() {
        return deXuatMuaRepository.findAll().stream()
                .map(DeXuatMuaResponse::from)
                .toList();
    }

    @Override
    public DeXuatMuaResponse getById(String id) throws DataNotFoundException {
        return deXuatMuaRepository.findById(id)
                .map(DeXuatMuaResponse::from)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đề xuất"));
    }

    @Override
    public List<DeXuatMuaResponse> getMyProposals(String maNguoiDung) {
        // Cần viết thêm hàm findByNguoiTao_MaND trong Repository
        // return deXuatMuaRepository.findByNguoiTao_MaND(maNguoiDung)...
        return null; // Tạm thời
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('HIEUTRUONG')")
    @Override
    @Transactional
    public DeXuatMuaResponse approve(String maDeXuat, String maNguoiDuyet) throws DataNotFoundException {

        // 1. Tìm đề xuất (Entity)
        DeXuatMua deXuat = deXuatMuaRepository.findById(maDeXuat)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đề xuất: " + maDeXuat));

        // 2. Tìm người duyệt (Entity)
        NguoiDung approver = nguoiDungRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new DataNotFoundException("Người duyệt không hợp lệ: " + maNguoiDuyet));

        // 3. Cập nhật trạng thái và lưu dấu vết (Audit)
        deXuat.setTrangThai("Đã duyệt");
        deXuat.setNguoiDuyet(approver);
        deXuat.setNgayDuyet(LocalDate.now());

        DeXuatMua saved = deXuatMuaRepository.save(deXuat);

        // 4. Trả về Response DTO đã tính toán lại Tổng tiền (Nhiệm vụ của Response)
        return DeXuatMuaResponse.from(saved);
    }

    // Hàm từ chối
    @PreAuthorize("hasRole('ADMIN') or hasRole('HIEUTRUONG')")
    @Override
    @Transactional
    public DeXuatMuaResponse reject(String maDeXuat, String maNguoiDuyet) throws DataNotFoundException {

        // 1. Tìm đề xuất (Entity)
        DeXuatMua deXuat = deXuatMuaRepository.findById(maDeXuat)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy đề xuất: " + maDeXuat));

        // 2. Tìm người duyệt (Entity)
        NguoiDung approver = nguoiDungRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new DataNotFoundException("Người duyệt không hợp lệ: " + maNguoiDuyet));

        // 3. Cập nhật trạng thái và lưu dấu vết
        deXuat.setTrangThai("Từ chối");
        deXuat.setNguoiDuyet(approver);
        deXuat.setNgayDuyet(LocalDate.now()); // Lưu ngày từ chối

        DeXuatMua saved = deXuatMuaRepository.save(deXuat);

        // 4. Trả về Response DTO đã cập nhật
        return DeXuatMuaResponse.from(saved);
    }
}