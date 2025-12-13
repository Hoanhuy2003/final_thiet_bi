import React, { useState, useEffect } from 'react';
import { Edit, Package, Calendar, DollarSign, Building2, AlertCircle, History, Tag, TrendingUp, TrendingDown, Factory, ClipboardCheck } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance"; 
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success",
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger",
  "Chờ thanh lý": "bg-secondary",
  "Sẵn sàng": "bg-primary",
  "Đã thanh lý": "bg-dark",
  "Hết khấu hao": "bg-info text-dark",
};

// ===============================================================
// HÀM TIỆN ÍCH CHO NGÀY THÁNG (AN TOÀN CHO SẮP XẾP VÀ HIỂN THỊ)
// ===============================================================

// Hàm chuyển đổi chuỗi/mảng ngày tháng sang đối tượng Date HỢP LỆ để so sánh
const parseDateForSorting = (dateData) => {
    if (!dateData) return new Date(0); 

    if (Array.isArray(dateData) && dateData.length >= 3) {
        // Xử lý mảng LocalDate/LocalDateTime: [năm, tháng, ngày, giờ, phút, giây]
        // Tháng Java (1-12) phải trừ 1 để dùng trong JS (0-11)
        return new Date(dateData[0], dateData[1] - 1, dateData[2], dateData[3] || 0, dateData[4] || 0, dateData[5] || 0);
    }
    
    if (typeof dateData === 'string' && dateData.includes('/')) {
        // Xử lý chuỗi dd/MM/yyyy: Chuyển sang MM/dd/yyyy để JS parse đúng
        const [datePart, timePart] = dateData.split(' ');
        const [day, month, year] = datePart.split('/');
        
        const validDateStr = `${month}/${day}/${year}` + (timePart ? ` ${timePart}` : '');
        return new Date(validDateStr);
    }

    return new Date(dateData);
}

// Hàm format ngày hiển thị (chỉ ngày/tháng/năm vì bạn dùng LocalDate)
const formatDate = (d) => {
    if (!d) return "Chưa có";
    
    // Sử dụng hàm parse để tạo đối tượng Date hợp lệ
    const dateObj = parseDateForSorting(d);
    
    if (isNaN(dateObj.getTime())) {
        // Nếu parseDateForSorting không thành công
        return "Lỗi ngày tháng";
    }

    // Chỉ hiển thị ngày, tháng, năm
    return dateObj.toLocaleDateString("vi-VN", {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

// ===============================================================

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [lichSu, setLichSu] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      const dataStr = localStorage.getItem("selectedEquipment");
      if (dataStr) {
        const eqBasic = JSON.parse(dataStr);
        setEquipment(eqBasic);
        setLoading(true);

        try {
          // Lấy chi tiết thiết bị
          const res = await equipmentService.getById(eqBasic.maTB);
          const eqFull = res.data?.result || res.data || eqBasic;
          setEquipment(eqFull);

          // Lấy lịch sử hoạt động (CHỈ CẦN GỌI 1 API)
          const resLichSu = await axiosInstance.get(`/api/lich-su-thiet-bi/${eqBasic.maTB}`);
          const fetchedLichSu = resLichSu.data?.result || resLichSu.data || [];
          
          // LOGIC SẮP XẾP MỚI NHẤT LÊN ĐẦU (ĐÃ SỬ DỤNG HÀM PARSE AN TOÀN)
          const sortedLichSu = fetchedLichSu.sort((a, b) => {
              const dateA = parseDateForSorting(a.ngayThayDoi);
              const dateB = parseDateForSorting(b.ngayThayDoi);
              
              // Sắp xếp MỚI NHẤT LÊN ĐẦU (dateB - dateA)
              return dateB.getTime() - dateA.getTime(); 
          });

          setLichSu(sortedLichSu);
        } catch (err) {
          toast.error("Không tải được chi tiết hoặc lịch sử thiết bị");
          setEquipment(eqBasic);
          setLichSu([]);
        } finally {
          setLoading(false);
        }
        setIsOpen(true);
      }
    };

    window.addEventListener("openDetailEquipmentModal", handler);
    return () => window.removeEventListener("openDetailEquipmentModal", handler);
  }, []);

  const formatCurrency = (v) => v ? new Intl.NumberFormat("vi-VN").format(v) + " đ" : "0 đ";
  
  // Helper: Xử lý an toàn giá trị DTO (String hoặc Object)
  const getDisplayValue = (data) => {
      if (!data) return "Chưa phân bổ";
      if (typeof data === 'object') {
          return data.tenPhong || data.tenLoai || data.ten || "Tên bị lỗi";
      }
      return data;
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Chi tiết thiết bị: {equipment?.maTB} - {equipment?.tenTB}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading} />
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3">Đang tải chi tiết...</p>
              </div>
            ) : (
              <>
                {/* PHẦN THÔNG TIN CHUNG */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Mã thiết bị</h6>
                    <p className="mb-0 fw-bold">{equipment?.maTB}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Tên thiết bị</h6>
                    <p className="mb-0">{equipment?.tenTB}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1">
                      <Factory size={16} /> Nhà cung cấp
                    </h6>
                    <p className="mb-0 fw-semibold">
                      {equipment?.nhaCungCap || "Chưa xác định"}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1"><Building2 size={16} /> Phòng / Vị trí</h6>
                    <p className="mb-0 fw-semibold">{getDisplayValue(equipment?.phong)}</p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="text-muted mb-1"><Tag size={16} /> Loại thiết bị</h6>
                    <p className="mb-0">{getDisplayValue(equipment?.loai)}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1"><AlertCircle size={16} /> Trạng thái</h6>
                    <span className={`badge ${statusColors[equipment?.tinhTrang]} fw-normal fs-6`}>
                      {equipment?.tinhTrang}
                    </span>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1"><Calendar size={16} /> Ngày sử dụng</h6>
                    <p className="mb-0">{formatDate(equipment?.ngaySuDung)}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1">Nguyên giá</h6>
                    <p className="mb-0 fw-bold text-success">{formatCurrency(equipment?.giaTriBanDau)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-1 d-flex align-items-center gap-1">
                      {equipment?.giaTriHienTai > 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                      Giá trị hiện tại
                    </h6>
                    <p className="mb-0 fw-bold text-primary">
                      {formatCurrency(equipment?.giaTriHienTai)}
                    </p>
                  </div>
                  
                </div>

                {/* PHẦN LỊCH SỬ THIẾT BỊ (ĐÃ SẮP XẾP VÀ DÙNG TRƯỜNG MỚI) */}
                <div className="mt-5 border-top pt-4">
                  <h5 className="mb-3 d-flex align-items-center gap-2">
                    <History size={20} className="text-primary" />
                    Lịch sử hoạt động ({lichSu.length})
                  </h5>
                  {lichSu.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Thời gian</th>
                            <th>Hoạt động</th> 
                            <th>Người thực hiện</th>
                            <th>Thay đổi trạng thái</th>
                            <th>Thay đổi phòng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lichSu.map((ls, index) => (
                            <tr key={index}>
                              <td>{formatDate(ls.ngayThayDoi)}</td>
                              
                              {/* CỘT HOẠT ĐỘNG (Dùng ls.hanhDong) */}
                              <td>
                                <span className="fw-semibold text-primary">
                                    {/* Nếu là Kiểm kê thì dùng icon */}
                                    {ls.hanhDong?.includes("Kiểm kê") ? (
                                        <ClipboardCheck size={16} className="me-1"/>
                                    ) : (
                                        <History size={16} className="me-1"/>
                                    )}
                                    {ls.hanhDong || "Cập nhật thông tin"}
                                </span>
                              </td>

                              <td>{ls.tenNguoiThayDoi || ls.nguoiThucHien || "Hệ thống"}</td>
                              
                              {/* THAY ĐỔI TRẠNG THÁI (Dùng trường mới) */}
                              <td>
                                {ls.trangThaiCu && ls.trangThaiMoi && !ls.trangThaiCu.includes(ls.trangThaiMoi) 
                                    ? `${ls.trangThaiCu} → ${ls.trangThaiMoi}` 
                                    : (ls.trangThaiCu ? ls.trangThaiCu : "-") // Nếu không thay đổi, hiển thị trạng thái cũ
                                }
                              </td>
                              
                              {/* THAY ĐỔI PHÒNG (Dùng trường mới) */}
                              <td>
                                {ls.phongCu && ls.phongMoi && !ls.phongCu.includes(ls.phongMoi) 
                                    ? `${ls.phongCu} → ${ls.phongMoi}` 
                                    : "-"
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">Chưa có lịch sử hoạt động nào.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer bg-light">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => window.dispatchEvent(new Event("openEditEquipmentModal")), 300);
              }}
            >
              <Edit size={16} /> Chỉnh sửa
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}