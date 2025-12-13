package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ThietBiDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThietBiService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import com.thiet_thi.project_one.responses.ThietBiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ThietBiService implements IThietBiService {

    private final ThietBiRepository thietBiRepository;
    private final LoThietBiRepository loThietBiRepository;
    private final LoaiThietBiRepository loaiThietBiRepository;
    private final PhongRepository phongRepository;
    private final LichSuThietBiRepository lichSuThietBiRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final NhaCungCapRepository nhaCungCapRepository;

    @Override
    @Transactional
    public ThietBi createThietBi(ThietBiDto dto) {
        String maTB = generateMaTB();

        LoaiThietBi loai = loaiThietBiRepository.findById(dto.getMaLoai())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy loại thiết bị"));

        LoThietBi lo = null;
        if (dto.getMaLo() != null && !dto.getMaLo().isBlank()) {
            lo = loThietBiRepository.findById(dto.getMaLo())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy lô thiết bị"));
        }

        Phong phong = null;
        if (dto.getMaPhong() != null && !dto.getMaPhong().isBlank()) {
            phong = phongRepository.findById(dto.getMaPhong())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng"));
        }

        // --- TÍNH TOÁN TRẠNG THÁI (Logic Khấu hao) ---
        String tinhTrang = dto.getTinhTrang() != null ? dto.getTinhTrang() : "Đang sử dụng";
        BigDecimal giaTriHienTai = dto.getGiaTriHienTai() != null ? dto.getGiaTriHienTai() : dto.getGiaTriBanDau();

        if (giaTriHienTai.compareTo(BigDecimal.ZERO) == 0 && !"Đã thanh lý".equals(tinhTrang)) {
            tinhTrang = "Hết khấu hao";
        }
        NhaCungCap nhaCungCap = nhaCungCapRepository.findById(dto.getMaNhaCungCap())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy nhà cung cấp")) ;

        ThietBi tb = ThietBi.builder()
                .maTB(maTB)
                .tenTB(dto.getTenTB())
                .loThietBi(lo)
                .loaiThietBi(loai)
                .phong(phong)
                .tinhTrang(tinhTrang)
                .giaTriBanDau(dto.getGiaTriBanDau())
                .giaTriHienTai(giaTriHienTai)
                .ngaySuDung(dto.getNgaySuDung() != null ? dto.getNgaySuDung() : LocalDate.now())
                .soSeri(dto.getSoSeri())
                .thongSoKyThuat(dto.getThongSoKyThuat())
                .maNhaCungCap(nhaCungCap)
                .build();

        return thietBiRepository.save(tb);
    }

    private String generateMaTB() {
        long count = thietBiRepository.count();
        return String.format("TB%03d", count + 1);
    }

    @Override
    public ThietBiResponse getById(String maThietBi) throws DataNotFoundException {
        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị có mã: " + maThietBi));

        List<ThietBiResponse.LichSuHoatDong> lichSu = lichSuThietBiRepository
                .findLichSuByMaTB(maThietBi)
                .stream()
                .map(ls -> ThietBiResponse.LichSuHoatDong.builder()
                        .ngayThayDoi(ls.getNgayThayDoi())
                        .nguoiThucHien(ls.getNguoiThayDoi() != null ? ls.getNguoiThayDoi().getTenND() : "Hệ thống")
                        .build())
                .toList();

        return ThietBiResponse.fromThietBiDetail(tb, lichSu);
    }

    @Override
    public Page<ThietBiResponse> getAll(Pageable pageable) {
        return thietBiRepository.findAll(pageable).map(ThietBiResponse::fromThietBi);
    }

    @Override
    public List<ThietBiResponse> getAllAsList() {
        return thietBiRepository.findAll().stream()
                .map(ThietBiResponse::fromThietBi)
                .toList();
    }

    @Override
    public Page<ThietBiResponse> searchAndFilter(
            String search,
            String maLoai,
            String tinhTrang,
            String maPhong,
            String maDonVi,
            Pageable pageable) {

        Page<ThietBi> thietBiPage = thietBiRepository.findByCriteria(
                search,
                maLoai,
                tinhTrang,
                maPhong,
                maDonVi,
                pageable
        );

        return thietBiPage.map(ThietBiResponse::fromThietBi);
    }

    @Override
    @Transactional
    public ThietBi updateThietBi(String maThietBi, ThietBiDto dto) throws DataNotFoundException {
        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị với mã: " + maThietBi));

        // 1. Lưu lại thông tin cũ để ghi log & so sánh
        String phongCu = tb.getPhong() != null ? tb.getPhong().getTenPhong() : "Chưa phân bổ";
        String tinhTrangCu = tb.getTinhTrang();
        // Lấy tên loại cũ
        String loaiCu = tb.getLoaiThietBi() != null ? tb.getLoaiThietBi().getTenLoai() : "Chưa xác định";

        // 2. Xử lý Phòng
        Phong phongMoi = tb.getPhong();
        if (dto.getMaPhong() != null && !dto.getMaPhong().isBlank()) {
            phongMoi = phongRepository.findById(dto.getMaPhong())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phòng"));
        }

        // 3. Xử lý Loại
        LoaiThietBi loaiMoi = tb.getLoaiThietBi();
        if (dto.getMaLoai() != null && !dto.getMaLoai().isBlank()) {
            loaiMoi = loaiThietBiRepository.findById(dto.getMaLoai())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy loại thiết bị"));
        }

        // 4. Cập nhật thông tin chính của thiết bị
        tb.setTenTB(dto.getTenTB());
        tb.setLoThietBi(dto.getMaLo() != null ? loThietBiRepository.findById(dto.getMaLo()).orElse(null) : tb.getLoThietBi());
        tb.setLoaiThietBi(loaiMoi);
        tb.setPhong(phongMoi);

        // 5. Cập nhật trạng thái và giá trị (Logic Khấu hao)
        if (dto.getGiaTriHienTai() != null) {
            tb.setGiaTriHienTai(dto.getGiaTriHienTai());
            if (dto.getGiaTriHienTai().compareTo(BigDecimal.ZERO) == 0 && !"Đã thanh lý".equals(tb.getTinhTrang())) {
                tb.setTinhTrang("Hết khấu hao");
            }
        }
        if (dto.getTinhTrang() != null) {
            tb.setTinhTrang(dto.getTinhTrang());
        }

        // Cập nhật các trường khác
        if(dto.getSoSeri() != null) tb.setSoSeri(dto.getSoSeri());
        if(dto.getThongSoKyThuat() != null) tb.setThongSoKyThuat(dto.getThongSoKyThuat());
        if(dto.getNgaySuDung() != null) tb.setNgaySuDung(dto.getNgaySuDung());

        // --- 6. GHI LỊCH SỬ THAY ĐỔI (LOGIC GỘP VÀ CHUẨN XÁC) ---
        String tenPhongMoi = phongMoi != null ? phongMoi.getTenPhong() : "Chưa phân bổ";
        String loaiMoiTen = loaiMoi != null ? loaiMoi.getTenLoai() : "Chưa xác định";

        boolean phongChanged = !Objects.equals(phongCu, tenPhongMoi);
        boolean trangThaiChanged = !Objects.equals(tinhTrangCu, tb.getTinhTrang());
        boolean loaiChanged = !Objects.equals(loaiCu, loaiMoiTen);

        if (phongChanged || trangThaiChanged || loaiChanged) {

            // Xây dựng Ghi chú
            StringBuilder ghiChuBuilder = new StringBuilder();
            List<String> actions = new java.util.ArrayList<>();
            String hanhDong = "Cập nhật";

            if (phongChanged) {
                actions.add("Điều chuyển");
                ghiChuBuilder.append(String.format("Phòng: %s -> %s. ", phongCu, tenPhongMoi));
            }
            if (trangThaiChanged) {
                actions.add("Trạng thái");
                ghiChuBuilder.append(String.format("Trạng thái: %s -> %s. ", tinhTrangCu, tb.getTinhTrang()));
            }
            if (loaiChanged) {
                actions.add("Loại thiết bị");
                ghiChuBuilder.append(String.format("Loại: %s -> %s. ", loaiCu, loaiMoiTen));
            }

            // Xác định hành động chính (Ưu tiên "Điều chuyển" nếu có thay đổi phòng)
            if (actions.contains("Điều chuyển")) {
                hanhDong = "Điều chuyển";
                if (actions.size() > 1) {
                    hanhDong = "Điều chuyển và Cập nhật thuộc tính";
                }
            } else if (actions.size() == 1) {
                hanhDong = actions.get(0); // VD: "Trạng thái" hoặc "Loại thiết bị"
            } else if (actions.size() > 1) {
                hanhDong = "Cập nhật nhiều thuộc tính";
            }

            // GỌI LOG MỘT LẦN DUY NHẤT VỚI ĐẦY ĐỦ THÔNG TIN
            createHistoryLog(
                    tb,
                    hanhDong,
                    ghiChuBuilder.toString().trim(),
                    phongCu, tenPhongMoi,
                    tinhTrangCu, tb.getTinhTrang(),
                    loaiCu, loaiMoiTen
            );
        }

        return thietBiRepository.save(tb);
    }

    // Hàm phụ trợ ghi log (CẦN SỬA ĐỂ NHẬN VÀ LƯU 8 THAM SỐ)
    private void createHistoryLog(ThietBi tb, String hanhDong, String ghiChu,
                                  String phongCu, String phongMoi,
                                  String ttCu, String ttMoi,
                                  String loaiCu, String loaiMoi) {

        // ⚠️ Chắc chắn Entity LichSuThietBi đã có đủ 8 trường này
        LichSuThietBi ls = LichSuThietBi.builder()
                .maLichSu("LS" + System.currentTimeMillis())
                .thietBi(tb)

                // LƯU CÁC GIÁ TRỊ CŨ VÀ MỚI
                .phongCu(phongCu)
                .phongMoi(phongMoi)
                .trangThaiCu(ttCu)
                .trangThaiMoi(ttMoi)
                .loaiCu(loaiCu)
                .loaiMoi(loaiMoi)

                // LƯU HÀNH ĐỘNG VÀ GHI CHÚ
                .hanhDong(hanhDong)
                .ghiChu(ghiChu)

                // Dùng LocalDateTime.now() (Nếu Entity dùng LocalDate thì thay thế)
                .ngayThayDoi(java.time.LocalDate.now())
                .nguoiThayDoi(getCurrentUser())
                .build();
        lichSuThietBiRepository.save(ls);
    }

    public NguoiDung getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Người dùng chưa đăng nhập!");
        }

        String maND = null;
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
            Map<String, Object> attributes = jwtToken.getTokenAttributes();
            maND = (String) attributes.get("maND");
        }

        if (maND == null) {
            // Fallback nếu token không chuẩn
            maND = authentication.getName();
        }

        return nguoiDungRepository.findById(maND)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng có mã: " + authentication.getName()));
    }

    @Override
    public void deleteThietBi(String maThietBi) throws DataNotFoundException {
        ThietBi tb = thietBiRepository.findById(maThietBi)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị để xóa"));
        thietBiRepository.delete(tb);
    }

}