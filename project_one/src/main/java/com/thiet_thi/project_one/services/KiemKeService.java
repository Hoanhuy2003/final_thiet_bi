package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.dtos.ChiTietKiemKeDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IKiemKeService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KiemKeService implements IKiemKeService {

    private final KiemKeRepository kiemKeRepository;
    private final ChiTietKiemKeRepository chiTietKiemKeRepository;
    private final ThietBiRepository thietBiRepository;
    private final LichSuThietBiRepository lichSuThietBiRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final PhongRepository phongRepository;

    // --- UTILITY: Lấy User hiện tại ---
    public NguoiDung getCurrentUser() throws DataNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập!");
        }
        String maND = null;
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Map<String, Object> attributes = jwtToken.getTokenAttributes();
            maND = (String) attributes.get("maND");
        }
        if (maND == null) throw new DataNotFoundException("Token không hợp lệ.");

        return nguoiDungRepository.findById(maND)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user."));
    }

    // --- UTILITY: Ghi Log Lịch Sử ---
    @Transactional
    public void createHistoryLog(ThietBi tb, String hanhDong, String ghiChu,
                                 String ttCu, String ttMoi, NguoiDung nguoiThucHien) {
        LichSuThietBi ls = LichSuThietBi.builder()
                .maLichSu("LS" + UUID.randomUUID())
                .thietBi(tb)
                .hanhDong(hanhDong)
                .ghiChu(ghiChu)
                .phongCu(tb.getPhong() != null ? tb.getPhong().getTenPhong() : null)
                .phongMoi(tb.getPhong() != null ? tb.getPhong().getTenPhong() : null)
                .trangThaiCu(ttCu)
                .trangThaiMoi(ttMoi)
                .ngayThayDoi(LocalDate.now())
                .nguoiThayDoi(nguoiThucHien)
                .build();
        lichSuThietBiRepository.save(ls);
    }

    // --- 1. TẠO PHIẾU MỚI (Header) ---
    @Override
    @Transactional
    public KiemKe createNewSession(KiemKeDto dto) throws DataNotFoundException {
        NguoiDung nguoiTao = nguoiDungRepository.findById(dto.getMaNguoiKiemKe())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người kiểm kê: " + dto.getMaNguoiKiemKe()));

        Phong phong = phongRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng: " + dto.getMaPhong()));

        String maKiemKe = "KK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        KiemKe kiemKe = KiemKe.builder()
                .maKiemKe(maKiemKe)
                .nguoiKiemKe(nguoiTao)
                .phong(phong)
                .ngayKiemKe(dto.getNgayKiemKe() != null ? dto.getNgayKiemKe() : LocalDate.now())
                .trangThai("Mới tạo")
                .ghiChu(dto.getGhiChu())
                .build();

        KiemKe savedKiemKe = kiemKeRepository.save(kiemKe);

        // Init proxy để tránh lỗi Lazy khi map sang DTO
        if (savedKiemKe.getPhong() != null) savedKiemKe.getPhong().getTenPhong();
        if (savedKiemKe.getNguoiKiemKe() != null) savedKiemKe.getNguoiKiemKe().getTenND();

        return savedKiemKe;
    }

    // --- 2. SUBMIT KẾT QUẢ (Logic Cá Thể Hóa) ---
    @Override
    @Transactional
    public KiemKe submitChecklist(KiemKeDto dto) throws DataNotFoundException {
        KiemKe kiemKe = kiemKeRepository.findById(dto.getMaKiemKe())
                .orElseThrow(() -> new DataNotFoundException("Phiếu không tồn tại"));

        NguoiDung nguoiThucHien = nguoiDungRepository.findById(dto.getMaNguoiKiemKe())
                .orElseThrow(() -> new DataNotFoundException("Người thực hiện không tồn tại"));

        // Xóa chi tiết cũ (ghi đè)
        chiTietKiemKeRepository.deleteAll(kiemKe.getChiTiet());
        kiemKe.getChiTiet().clear();

        for (ChiTietKiemKeDto ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Thiết bị k tồn tại: " + ctDto.getMaTB()));

            String trangThaiCu = tb.getTinhTrang();
            String trangThaiMoi = trangThaiCu;
            String ketQuaKiemKe = ctDto.getTinhTrangThucTe(); // Tốt, Hỏng, Mất

            // --- Logic Update Trạng Thái Cá Thể ---
            if ("Hỏng".equalsIgnoreCase(ketQuaKiemKe)) {
                trangThaiMoi = "Hỏng hóc";
            } else if ("Mất".equalsIgnoreCase(ketQuaKiemKe)) {
                trangThaiMoi = "Chờ thanh lý";
            } else if ("Tốt".equalsIgnoreCase(ketQuaKiemKe)) {
                // Khôi phục nếu trước đó đang báo lỗi
                if ("Hỏng hóc".equals(trangThaiCu) || "Chờ thanh lý".equals(trangThaiCu) || "Bảo trì".equals(trangThaiCu)) {
                    trangThaiMoi = "Đang sử dụng";
                }
            }

            // Update DB & Log nếu trạng thái đổi
            if (!trangThaiCu.equals(trangThaiMoi)) {
                tb.setTinhTrang(trangThaiMoi);
                thietBiRepository.save(tb);
                createHistoryLog(tb, "Kiểm kê",
                        String.format("Kết quả: %s. Ghi chú: %s", ketQuaKiemKe, ctDto.getGhiChu()),
                        trangThaiCu, trangThaiMoi, nguoiThucHien);
            }

            // Lưu Chi Tiết (Quan trọng: Lưu snapshot trangThaiCu vào tinhTrangHeThong)
            ChiTietKiemKe chiTiet = ChiTietKiemKe.builder()
                    .maCTKK(UUID.randomUUID().toString())
                    .kiemKe(kiemKe)
                    .thietBi(tb)
                    .tinhTrangHeThong(trangThaiCu) // <--- Snapshot trạng thái GỐC
                    .tinhTrangThucTe(ketQuaKiemKe)
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            kiemKe.getChiTiet().add(chiTiet);
        }

        kiemKe.setTrangThai("Hoàn thành");
        kiemKe.setNgayKetThuc(LocalDate.now());

        return kiemKeRepository.save(kiemKe);
    }

    // --- 3. GET REPORT (Dùng DTO Response) ---
    @Override
    @Transactional(readOnly = true)
    public KiemKe getReportById(String maKiemKe) throws DataNotFoundException {
        KiemKe kiemKe = kiemKeRepository.findById(maKiemKe)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phiếu"));

        Hibernate.initialize(kiemKe.getChiTiet());
        if(kiemKe.getPhong() != null) kiemKe.getPhong().getTenPhong();
        if(kiemKe.getNguoiKiemKe() != null) kiemKe.getNguoiKiemKe().getTenND();

        return kiemKe;
    }

    // --- 4. GET LIST ---
    @Override
    @Transactional(readOnly = true)
    public Page<KiemKeResponse> getAllKiemKeSessions(Pageable pageable) {
        return kiemKeRepository.findAll(pageable).map(KiemKeResponse::fromKiemKe);
    }

    @Override
    public KiemKe getById(String maKiemKe) throws DataNotFoundException {
        return getReportById(maKiemKe);
    }
    @Override
    @Transactional(readOnly = true)
    public Page<KiemKeResponse> filterKiemKeSessions(String keyword, String maPhong, String trangThai, Pageable pageable) {
        // Gọi Repository
        Page<KiemKe> pageResult = kiemKeRepository.findSessionsWithFilter(keyword, maPhong, trangThai, pageable);

        // Map sang DTO
        return pageResult.map(KiemKeResponse::fromKiemKe);
    }
}