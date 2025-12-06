// src/main/java/com/thiet_thi/project_one/services/impl/PhieuThanhLyService.java
package com.thiet_thi.project_one.services;

import com.thiet_thi.project_one.dtos.ChiTietThanhLyDto;
import com.thiet_thi.project_one.dtos.PhieuThanhLyDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.iservices.IThanhLyService;
import com.thiet_thi.project_one.models.*;
import com.thiet_thi.project_one.repositorys.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhieuThanhLyService implements IThanhLyService {

    private final PhieuThanhLyRepository phieuThanhLyRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ThietBiRepository thietBiRepository;
    private final ChiTietPhieuThanhLyRepository chiTietRepository;

    // src/main/java/com/thiet_thi/project_one/services/impl/PhieuThanhLyService.java
    @Override
    @Transactional
    public PhieuThanhLy create(PhieuThanhLyDto dto) throws DataNotFoundException {

        // 1. Tìm người lập
        NguoiDung nguoiLap = nguoiDungRepository.findById(dto.getMaNguoiTao())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người lập phiếu"));
        NguoiDung nguoiDuyet = nguoiDungRepository.findById(dto.getMaNguoiDuyet())
                .orElseThrow(()-> new DataNotFoundException("Không tìm thấy người duyệt"));

        // 2. Tạo phiếu thanh lý
        PhieuThanhLy phieu = PhieuThanhLy.builder()
                .maPhieuThanhLy(dto.getMaPhieuThanhLy())
                .soPhieu(dto.getSoPhieu())
                .ngayLap(dto.getNgayLap())
                .ngayThanhLy(dto.getNgayThanhLy())
                .ngayDuyet(dto.getNgayDuyet())
                .hinhThuc(dto.getHinhThuc())
                .lyDoThanhLy(dto.getLyDoThanhLy())
                .ghiChu(dto.getGhiChu())
                .trangThai("Chờ duyệt")
                .nguoiLap(nguoiLap)
                .nguoiDuyet(nguoiDuyet)
                .tongGiaTriThuVe(BigDecimal.ZERO)
                .build();

        // 3. Xử lý chi tiết thanh lý – ĐÃ DÙNG CLASS RIÊNG, KHÔNG LỖI NỮA!
        for (ChiTietThanhLyDto ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thiết bị: " + ctDto.getMaTB()));

            ChiTietPhieuThanhLy chiTiet = ChiTietPhieuThanhLy.builder()
                    .maCTTL(ctDto.getMaCTTL())
                    .phieuThanhLy(phieu)
                    .thietBi(tb)
                    .nguyenGia(tb.getGiaTriBanDau())
                    .giaTriConLai(tb.getGiaTriHienTai())
                    .soNamSuDung(ctDto.getSoNamSuDung())
                    .hinhThucThanhLy(ctDto.getHinhThucThanhLy())
                    .lyDoThanhLy(ctDto.getLyDoThanhLy())
                    .giaTriThuVe(ctDto.getGiaTriThuVe() != null ? ctDto.getGiaTriThuVe() : BigDecimal.ZERO)
                    .ngayThanhLy(ctDto.getNgayThanhLy())
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            phieu.getChiTiet().add(chiTiet);

            // Cập nhật trạng thái thiết bị
            tb.setTinhTrang("Đã thanh lý");
            thietBiRepository.save(tb);
        }

        // 4. Tính tổng giá trị thu về
        BigDecimal tongThuVe = phieu.getChiTiet().stream()
                .map(ChiTietPhieuThanhLy::getGiaTriThuVe)
                .filter(g -> g != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        phieu.setTongGiaTriThuVe(tongThuVe);

        return phieuThanhLyRepository.save(phieu);
    }
    @Override
    public List<PhieuThanhLy> getAll() {
        return phieuThanhLyRepository.findAll();
    }

    @Override
    public PhieuThanhLy getByID(String maTL) throws DataNotFoundException {
        return phieuThanhLyRepository.findById(maTL)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy phiếu thanh lý: " + maTL));
    }

    @Override
    @Transactional
    public void delete(String maPhieu) throws DataNotFoundException {
        PhieuThanhLy phieu = getByID(maPhieu);

        if (!"Chờ duyệt".equals(phieu.getTrangThai())) {
            throw new IllegalStateException("Chỉ được xóa phiếu đang ở trạng thái 'Chờ duyệt'!");
        }

        // Khôi phục trạng thái thiết bị
        for (ChiTietPhieuThanhLy ct : phieu.getChiTiet()) {
            ThietBi tb = ct.getThietBi();
            tb.setTinhTrang("Đang sử dụng"); // hoặc trạng thái cũ
            thietBiRepository.save(tb);
        }

        // Xóa chi tiết trước, rồi xóa phiếu
        chiTietRepository.deleteAll(phieu.getChiTiet());
        phieuThanhLyRepository.delete(phieu);
    }

    @Override
    @Transactional
    public PhieuThanhLy update(String maPhieu, PhieuThanhLyDto dto) throws DataNotFoundException {
        PhieuThanhLy phieu = getByID(maPhieu);

        if ("Hoàn tất".equals(phieu.getTrangThai()) || "Đã duyệt".equals(phieu.getTrangThai())) {
            throw new IllegalStateException("Không thể sửa phiếu đã duyệt!");
        }

        // Khôi phục lại trạng thái thiết bị cũ trước khi xóa chi tiết
        for (ChiTietPhieuThanhLy ct : phieu.getChiTiet()) {
            ThietBi tb = ct.getThietBi();
            tb.setTinhTrang("Đang sử dụng"); // hoặc trạng thái cũ
            thietBiRepository.save(tb);
        }

        // Xóa chi tiết cũ
        chiTietRepository.deleteAll(phieu.getChiTiet());
        phieu.getChiTiet().clear();

        // Cập nhật thông tin phiếu
        phieu.setSoPhieu(dto.getSoPhieu());
        phieu.setNgayLap(dto.getNgayLap());
        phieu.setNgayThanhLy(dto.getNgayThanhLy());
        phieu.setHinhThuc(dto.getHinhThuc());
        phieu.setLyDoThanhLy(dto.getLyDoThanhLy());
        phieu.setGhiChu(dto.getGhiChu());

        BigDecimal tongThuVe = BigDecimal.ZERO;

        // Thêm chi tiết mới
        for (ChiTietThanhLyDto ctDto : dto.getChiTiet()) {
            ThietBi tb = thietBiRepository.findById(ctDto.getMaTB())
                    .orElseThrow(() -> new DataNotFoundException("Thiết bị không tồn tại: " + ctDto.getMaTB()));

            if ("Đã thanh lý".equals(tb.getTinhTrang())) {
                throw new IllegalStateException("Thiết bị " + tb.getMaTB() + " đã thanh lý ở phiếu khác!");
            }

            ChiTietPhieuThanhLy chiTiet = ChiTietPhieuThanhLy.builder()
                    .maCTTL(ctDto.getMaCTTL())
                    .phieuThanhLy(phieu)
                    .thietBi(tb)
                    .nguyenGia(tb.getGiaTriBanDau())
                    .giaTriConLai(tb.getGiaTriHienTai())
                    .soNamSuDung(ctDto.getSoNamSuDung())
                    .hinhThucThanhLy(ctDto.getHinhThucThanhLy())
                    .lyDoThanhLy(ctDto.getLyDoThanhLy())
                    .giaTriThuVe(ctDto.getGiaTriThuVe() != null ? ctDto.getGiaTriThuVe() : BigDecimal.ZERO)
                    .ngayThanhLy(ctDto.getNgayThanhLy())
                    .ghiChu(ctDto.getGhiChu())
                    .build();

            phieu.getChiTiet().add(chiTiet);
            tongThuVe = tongThuVe.add(chiTiet.getGiaTriThuVe());

            tb.setTinhTrang("Đã thanh lý");
            thietBiRepository.save(tb);
        }

        phieu.setTongGiaTriThuVe(tongThuVe);
        return phieuThanhLyRepository.save(phieu);
    }

//    // Bonus: Duyệt phiếu
//    @Transactional
//    public PhieuThanhLy duyetPhieu(String maPhieu, String maNguoiDuyet) throws DataNotFoundException {
//        PhieuThanhLy phieu = getByID(maPhieu);
//        NguoiDung nguoiDuyet = nguoiDungRepository.findById(maNguoiDuyet)
//                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người duyệt"));
//
//        phieu.setTrangThai("Hoàn tất");
//        phieu.setNguoiDuyet(nguoiDuyet);
//        phieu.setNgayDuyet(java.time.LocalDate.now());
//
//        return phieuThanhLyRepository.save(phieu);
//    }
    @Override
    @Transactional
    public PhieuThanhLy duyetPhieu(String maPhieu, String maNguoiDuyet) throws DataNotFoundException {
        PhieuThanhLy phieu = getByID(maPhieu);

        // Kiểm tra trạng thái
        if (!"Chờ duyệt".equals(phieu.getTrangThai())) {
            throw new IllegalStateException("Chỉ được duyệt phiếu đang ở trạng thái 'Chờ duyệt'!");
        }

        NguoiDung nguoiDuyet = nguoiDungRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người duyệt: " + maNguoiDuyet));

        // Cập nhật trạng thái phiếu
        phieu.setTrangThai("Hoàn tất");
        phieu.setNguoiDuyet(nguoiDuyet);
        phieu.setNgayDuyet(java.time.LocalDate.now());

        // Cập nhật trạng thái tất cả thiết bị trong phiếu thành "Đã thanh lý"
        for (ChiTietPhieuThanhLy ct : phieu.getChiTiet()) {
            ThietBi tb = ct.getThietBi();
            tb.setTinhTrang("Đã thanh lý");
            thietBiRepository.save(tb);
        }

        return phieuThanhLyRepository.save(phieu);
    }

    @Override
    @Transactional
    public PhieuThanhLy tuChoiPhieu(String maPhieu, String maNguoiDuyet, String lyDoTuChoi) throws DataNotFoundException {
        PhieuThanhLy phieu = getByID(maPhieu);

        // Kiểm tra trạng thái
        if (!"Chờ duyệt".equals(phieu.getTrangThai())) {
            throw new IllegalStateException("Chỉ được từ chối phiếu đang ở trạng thái 'Chờ duyệt'!");
        }

        NguoiDung nguoiDuyet = nguoiDungRepository.findById(maNguoiDuyet)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người duyệt: " + maNguoiDuyet));

        // Cập nhật trạng thái phiếu
        phieu.setTrangThai("Từ chối");
        phieu.setNguoiDuyet(nguoiDuyet);
        phieu.setNgayDuyet(java.time.LocalDate.now());
        phieu.setGhiChu((phieu.getGhiChu() != null ? phieu.getGhiChu() + "\n" : "")
                + "Từ chối bởi " + nguoiDuyet.getTenND() + ": " + lyDoTuChoi);

        // KHÔI PHỤC trạng thái thiết bị về "Đang sử dụng" (hoặc trạng thái cũ nếu bạn lưu)
        for (ChiTietPhieuThanhLy ct : phieu.getChiTiet()) {
            ThietBi tb = ct.getThietBi();
            // Nếu bạn có lưu trạng thái cũ → dùng nó, còn không thì mặc định "Đang sử dụng"
            tb.setTinhTrang("Đang sử dụng");
            thietBiRepository.save(tb);
        }

        return phieuThanhLyRepository.save(phieu);
    }
}