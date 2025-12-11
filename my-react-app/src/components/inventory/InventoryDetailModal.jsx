// src/components/inventory/InventoryDetailModal.jsx
import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import toast from "react-hot-toast";
import { Eye, Clock, ClipboardCheck, Users, Tag } from "lucide-react";

// Màu sắc cho trạng thái kiểm kê thực tế
const inventoryStatusColors = {
  "Tồn tại": "bg-success", // Tồn tại
  "Hỏng": "bg-warning", 
  "Mất": "bg-danger",
};

export default function InventoryDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null); // Dữ liệu cơ bản từ bảng list
  const [reportData, setReportData] = useState(null); // Dữ liệu báo cáo đầy đủ từ API
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchReportDetails = async (maKiemKe) => {
    setLoadingDetails(true);
    try {
      const data = await inventoryService.getReportDetail(maKiemKe);
      setReportData(data);
    } catch (error) {
      console.error("Lỗi tải chi tiết báo cáo:", error);
      toast.error("Không thể tải báo cáo chi tiết.");
      setReportData(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedInventorySession");
      if (data) {
        const basicSession = JSON.parse(data);
        setSession(basicSession);
        
        // Bắt đầu tải dữ liệu báo cáo đầy đủ
        if (basicSession.maKiemKe) {
            fetchReportDetails(basicSession.maKiemKe);
        }
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailInventoryModal", handler);
    return () => window.removeEventListener("openDetailInventoryModal", handler);
  }, []);

  // Định dạng ngày (giả định ngày trả về là String hoặc LocalDate)
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
 };

  if (!isOpen || !session) return null;
  const data = reportData || session; // Sử dụng reportData nếu có, fallback về session ban đầu

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <div>
              <h5 className="modal-title">
                <Eye size={20} className="me-2" /> Chi tiết báo cáo - {data.maKiemKe}
              </h5>
              <p className="text-muted mb-0 text-sm text-white">Trạng thái: {data.trangThai || "Đang tải"}</p>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            {loadingDetails ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-3">Đang tải báo cáo chi tiết...</p>
                </div>
            ) : (
                <>
                    {/* Phần 1: Thông tin chung và Thống kê */}
                    <div className="row g-3 mb-4 border-bottom pb-4">
                        <h6 className="text-primary mb-3">Thông tin chung</h6>
                        
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label mb-1 fw-bold"><Tag size={16} className="me-1"/> Mã Phiếu</label>
                            <p className="mb-0 text-primary fw-bold">{data.maKiemKe}</p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label mb-1 fw-bold">Phòng kiểm kê</label>
                            <p className="mb-0">{data.tenPhong || data.phong}</p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label mb-1 fw-bold"><Users size={16} className="me-1"/> Người thực hiện</label>
                            <p className="mb-0">{data.tenNguoiKiemKe || data.nguoi_kiem_ke}</p>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label mb-1 fw-bold"><Clock size={16} className="me-1"/> Ngày bắt đầu</label>
                            <p className="mb-0">{formatDate(data.ngayKiemKe || data.ngay_kiem_ke)}</p>
                        </div>
                        
                        <h6 className="text-primary mt-4 mb-3">Thống kê kết quả</h6>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-light border text-center py-2">
                                <label className="form-label mb-1">Tổng SL theo hệ thống</label>
                                <h4 className="mb-0 fw-bold">{data.tongSoLuong || data.tong_thiet_bi}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-success border text-center py-2">
                                <label className="form-label mb-1">Tồn tại (Tốt)</label>
                                <h4 className="mb-0 fw-bold">{data.tonTai || data.ton_tai}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-warning border text-center py-2">
                                <label className="form-label mb-1">Hỏng hóc</label>
                                <h4 className="mb-0 fw-bold">{data.hong || data.hong}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-danger border text-center py-2">
                                <label className="form-label mb-1">Mất/Thanh lý</label>
                                <h4 className="mb-0 fw-bold">{data.mat || data.mat}</h4>
                            </div>
                        </div>
                        <div className="col-12 text-center mt-3">
                            {data.tyLeDat && (
                                <p className="text-muted fw-bold">Tỷ lệ tồn tại (đã kiểm tra): <span className="text-success">{data.tyLeDat}</span></p>
                            )}
                        </div>
                    </div>
                    
                    {/* Phần 2: Danh sách chi tiết kiểm kê */}
                    <div className="mt-4">
                        <h6 className="text-primary mb-3">Danh sách thiết bị đã kiểm kê ({data.chiTiet?.length || 0})</h6>
                        
                        {data.chiTiet && data.chiTiet.length > 0 ? (
                            <div className="table-responsive" style={{ maxHeight: "400px" }}>
                                <table className="table table-striped table-hover mb-0 align-middle">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th>Mã TB</th>
                                            <th>Tên thiết bị</th>
                                            <th>Trạng thái hệ thống</th>
                                            <th>Kết quả thực tế</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.chiTiet.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.maTB}</td>
                                                <td>{item.tenTB}</td>
                                                <td><span className="badge bg-light text-dark">{item.tinhTrangHeThong}</span></td>
                                                <td>
                                                    <span className={`badge ${inventoryStatusColors[item.tinhTrangThucTe] || 'bg-secondary'}`}>
                                                        {item.tinhTrangThucTe}
                                                    </span>
                                                </td>
                                                <td>{item.ghiChu || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-info text-center">Phiếu này chưa có chi tiết kiểm kê nào được ghi nhận.</div>
                        )}
                    </div>
                </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}