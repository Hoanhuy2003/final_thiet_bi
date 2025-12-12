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

    // --- 2. SUBMIT KẾT QUẢ (LOGIC THÔNG MINH: TỰ ĐỘNG HOÀN THÀNH) ---
    @Override
    @Transactional
    public KiemKe submitChecklist(KiemKeDto dto) throws DataNotFoundException {
        // 1. Kiểm tra tồn tại
        KiemKe kiemKe = kiemKeRepository.findById(dto.getMaKiemKe())
                .orElseThrow(() -> new DataNotFoundException("Phiếu không tồn tại"));

        // 2. Validate người thực hiện
        NguoiDung nguoiThucHien = nguoiDungRepository.findById(dto.getMaNguoiKiemKe())
                .orElseThrow(() -> new DataNotFoundException("Người thực hiện không tồn tại"));

        // 3. Xóa chi tiết cũ để lưu lại trạng thái mới nhất
        chiTietKiemKeRepository.deleteAll(kiemKe.getChiTiet());
        kiemKe.getChiTiet().clear();

        // 4. Duyệt qua danh sách thiết bị gửi lên
        for (ChiTietKiemKeDto ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Thiết bị k tồn tại: " + ctDto.getMaTB()));

            String trangThaiCu = tb.getTinhTrang();
            String trangThaiMoi = trangThaiCu;
            String ketQuaKiemKe = ctDto.getTinhTrangThucTe(); // Giá trị: Tốt, Hỏng, Mất

            // --- Logic Cập nhật trạng thái Thiết bị ---
            if ("Hỏng".equalsIgnoreCase(ketQuaKiemKe)) {
                trangThaiMoi = "Hỏng hóc";
            } else if ("Mất".equalsIgnoreCase(ketQuaKiemKe)) {
                trangThaiMoi = "Chờ thanh lý"; // Hoặc "Mất" tùy quy định
            } else if ("Tốt".equalsIgnoreCase(ketQuaKiemKe)) {
                // Nếu thiết bị đang lỗi mà kiểm tra thấy Tốt -> Khôi phục về Đang sử dụng
                if ("Hỏng hóc".equals(trangThaiCu) || "Chờ thanh lý".equals(trangThaiCu) || "Bảo trì".equals(trangThaiCu)) {
                    trangThaiMoi = "Đang sử dụng";
                }
            }

            // Nếu trạng thái thay đổi -> Cập nhật vào bảng Thiết Bị & Ghi Log
            if (!trangThaiCu.equals(trangThaiMoi)) {
                tb.setTinhTrang(trangThaiMoi);
                thietBiRepository.save(tb);
                createHistoryLog(tb, "Kiểm kê",
                        String.format("Kết quả: %s. Ghi chú: %s", ketQuaKiemKe, ctDto.getGhiChu()),
                        trangThaiCu, trangThaiMoi, nguoiThucHien);
            }

            // Lưu chi tiết kiểm kê
            ChiTietKiemKe chiTiet = ChiTietKiemKe.builder()
                    .maCTKK(UUID.randomUUID().toString())
                    .kiemKe(kiemKe)
                    .thietBi(tb)
                    .tinhTrangHeThong(trangThaiCu) // Snapshot trạng thái cũ
                    .tinhTrangThucTe(ketQuaKiemKe)
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            kiemKe.getChiTiet().add(chiTiet);
        }

        // --- 5. LOGIC TRẠNG THÁI PHIẾU (ĐÃ THÊM MỚI TẠI ĐÂY) ---

        // Bước A: Đếm tổng số thiết bị thực tế của phòng này (Cần thêm hàm countByPhong ở ThietBiRepository)
        // Lưu ý: Nếu bạn chưa thêm hàm countByPhong thì dùng tạm list size của phòng nếu có, nhưng tốt nhất là count DB.
        long tongThietBiTrongPhong = thietBiRepository.countByPhong(kiemKe.getPhong());

        // Bước B: Đếm số lượng vừa lưu
        int soLuongDaKiem = kiemKe.getChiTiet().size();

        // Bước C: So sánh
        if (soLuongDaKiem >= tongThietBiTrongPhong && tongThietBiTrongPhong > 0) {
            // Nếu đã kiểm đủ -> Tự động Hoàn thành
            kiemKe.setTrangThai("Hoàn thành");
            kiemKe.setNgayKetThuc(LocalDate.now());
        } else {
            // Nếu chưa đủ -> Vẫn là Đang kiểm kê (Dù trước đó là Mới tạo hay gì đi nữa)
            kiemKe.setTrangThai("Đang kiểm kê");
            kiemKe.setNgayKetThuc(null); // Mở lại nếu lỡ đóng
        }

        return kiemKeRepository.save(kiemKe);
    }

    // --- 3. GET CHI TIẾT 1 PHIẾU ---
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

    @Override
    public KiemKe getById(String maKiemKe) throws DataNotFoundException {
        return getReportById(maKiemKe);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<KiemKeResponse> filterKiemKeSessions(String keyword, String maPhong, String trangThai, Pageable pageable) {

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanMaPhong = (maPhong != null && !maPhong.trim().isEmpty()) ? maPhong.trim() : null;
        String cleanTrangThai = (trangThai != null && !trangThai.trim().isEmpty()) ? trangThai.trim() : null;

        // Gọi Repository
        Page<KiemKe> pageResult = kiemKeRepository.findSessionsWithFilter(cleanKeyword, cleanMaPhong, cleanTrangThai, pageable);

        return pageResult.map(KiemKeResponse::fromKiemKe);
    }
}