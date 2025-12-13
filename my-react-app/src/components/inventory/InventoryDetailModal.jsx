import { useState, useEffect } from "react";
// 1. Thêm icon Download, Loader
import { Eye, Clock, ClipboardCheck, Users, Tag, Download, Loader } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";
import toast from "react-hot-toast";

const inventoryStatusColors = {
  "Tồn tại": "bg-success", 
  "Hỏng": "bg-warning text-dark", 
  "Mất": "bg-danger",
};

export default function InventoryDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // 2. State loading cho việc xuất file
  const [exporting, setExporting] = useState(false);

  // Hàm chuyển đổi Base64 sang Blob (cho Excel)
  const base64ToBlob = (base64Data, contentType) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

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
        
        if (basicSession.maKiemKe) {
            fetchReportDetails(basicSession.maKiemKe);
        }
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailInventoryModal", handler);
    return () => window.removeEventListener("openDetailInventoryModal", handler);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  // --- 3. HÀM XUẤT BIÊN BẢN CHI TIẾT ---
  const handleExportReport = async () => {
    if (!data?.maKiemKe) return;
    
    try {
      setExporting(true);
      toast.loading("Đang tạo biên bản kiểm kê...", { id: "exportReport" });

      // Gọi API xuất báo cáo chi tiết (theo mã phiếu)
      const apiResponse = await inventoryService.exportReportExcel(data.maKiemKe);

      if (apiResponse && apiResponse.result) {
        const blob = base64ToBlob(
          apiResponse.result,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Tên file: Bien_ban_kiem_ke_KK001.xlsx
        link.setAttribute('download', `Bien_ban_kiem_ke_${data.maKiemKe}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Đã xuất biên bản thành công!", { id: "exportReport" });
      } else {
        toast.error("Dữ liệu file bị trống", { id: "exportReport" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xuất biên bản: " + (error.response?.data || error.message), { id: "exportReport" });
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen || !session) return null;
  const data = reportData || session;
  
  // 4. Kiểm tra điều kiện để hiện nút In
  const isCompleted = data.trangThai === "Hoàn thành";

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* ... (Header và Body giữ nguyên code cũ) ... */}
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
                    {/* Phần 1: Thông tin chung */}
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
                                <label className="form-label mb-1">Tổng SL hệ thống</label>
                                <h4 className="mb-0 fw-bold">{data.tongSoLuong || 0}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-success border text-center py-2">
                                <label className="form-label mb-1">Tồn tại (Tốt)</label>
                                <h4 className="mb-0 fw-bold">{data.tonTai || 0}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-warning border text-center py-2">
                                <label className="form-label mb-1">Hỏng hóc</label>
                                <h4 className="mb-0 fw-bold">{data.hong || 0}</h4>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="alert alert-danger border text-center py-2">
                                <label className="form-label mb-1">Mất/Thanh lý</label>
                                <h4 className="mb-0 fw-bold">{data.mat || 0}</h4>
                            </div>
                        </div>
                        <div className="col-12 text-center mt-3">
                            {data.tyLeDat && (
                                <p className="text-muted fw-bold">Tỷ lệ tồn tại: <span className="text-success">{data.tyLeDat}</span></p>
                            )}
                        </div>
                    </div>
                    
                    {/* Phần 2: Danh sách chi tiết */}
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
                            <div className="alert alert-info text-center">Chưa có chi tiết nào.</div>
                        )}
                    </div>
                </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={exporting}>
              Đóng
            </button>

            {/* 5. NÚT XUẤT BIÊN BẢN (Chỉ hiện khi Hoàn thành) */}
            {isCompleted && (
                <button 
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={handleExportReport}
                    disabled={exporting}
                >
                    {exporting ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
                    {exporting ? "Đang xuất..." : "Xuất biên bản"}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}