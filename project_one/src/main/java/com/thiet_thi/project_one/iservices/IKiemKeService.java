package com.thiet_thi.project_one.iservices;

import com.thiet_thi.project_one.dtos.KiemKeDto;
import com.thiet_thi.project_one.exceptions.DataNotFoundException;
import com.thiet_thi.project_one.models.KiemKe;
import com.thiet_thi.project_one.responses.KiemKeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IKiemKeService {

    /**
     * Tạo một phiên kiểm kê mới (KiemKe header) gắn với một Phòng cụ thể.
     * @param dto DTO chứa maPhong và maNguoiKiemKe.
     * @return Entity KiemKe đã được tạo.
     */
    KiemKe createNewSession(KiemKeDto dto) throws DataNotFoundException;

    /**
     * Hoàn thành và gửi kết quả kiểm kê chi tiết.
     * Xử lý xóa chi tiết cũ, lưu chi tiết mới, cập nhật trạng thái ThietBi và ghi log.
     * @param dto Payload chứa maKiemKe và List<ChiTietKiemKeDto>.
     * @return Entity KiemKe sau khi cập nhật trạng thái "Hoàn thành".
     */
    KiemKe submitChecklist(KiemKeDto dto) throws DataNotFoundException;

    /**
     * Lấy Entity KiemKe đầy đủ (bao gồm chi tiết kiểm kê) cho mục đích báo cáo.
     * @param maKiemKe Mã phiếu kiểm kê.
     * @return Entity KiemKe.
     */
    KiemKe getReportById(String maKiemKe) throws DataNotFoundException;

    KiemKe getById(String maKiemKe) throws DataNotFoundException;
    Page<KiemKeResponse> getAllKiemKeSessions(Pageable pageable);
    Page<KiemKeResponse> filterKiemKeSessions(String keyword, String maPhong, String trangThai, Pageable pageable);
}