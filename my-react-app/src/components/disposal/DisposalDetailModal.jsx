import { useState, useEffect } from "react";
import { Edit, Package, Calendar, DollarSign, User, CheckCircle, XCircle, Download, Loader } from "lucide-react";
// 👇 1. Import hàm lấy ID thật
import { getUserRole, getUserId } from "../../services/authService"; 
import thanhLyService from "../../services/disposalService";
import toast from "react-hot-toast";

const statusColors = {
  "Chờ duyệt": "bg-warning text-dark",
  "Hoàn tất": "bg-success text-white",
  "Từ chối": "bg-danger text-white",
};

export default function DisposalDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phieu, setPhieu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const role = getUserRole();
  const canApprove = ["ADMIN", "HIEUTRUONG"].includes(role);

  // 👇 2. LẤY ID NGƯỜI DÙNG THẬT (Thay vì hardcode)
  const currentUserId = getUserId(); 

  useEffect(() => {
    const handler = async () => {
      const data = localStorage.getItem("selectedPhieuThanhLy");
      if (data) {
        const p = JSON.parse(data);
        setLoading(true);
        try {
          const detail = await thanhLyService.getByMa(p.maPhieuThanhLy);
          setPhieu(detail);
        } catch (err) {
          setPhieu(p);
          toast.error("Không tải được chi tiết đầy đủ");
        } finally {
          setLoading(false);
        }
        setIsOpen(true);
      }
    };

    window.addEventListener("openDetailThanhLyModal", handler);
    return () => window.removeEventListener("openDetailThanhLyModal", handler);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    try {
      if (typeof dateStr === "string") {
        if (dateStr.includes("/")) return dateStr;
        return new Date(dateStr).toLocaleDateString("vi-VN");
      }
      return dateStr.toLocaleDateString("vi-VN");
    } catch (e) {
      return dateStr || "Không hợp lệ";
    }
  };

  const formatCurrency = (v) => v ? new Intl.NumberFormat("vi-VN").format(v) + " đ" : "0 đ";

  // --- XUẤT BIÊN BẢN ---
  const handleExportBienBan = async () => {
    try {
      setExporting(true);
      toast.loading("Đang tạo biên bản...", { id: "exportBienBan" });

      const response = await thanhLyService.exportBienBan(phieu.maPhieuThanhLy);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bien_ban_thanh_ly_${phieu.maPhieuThanhLy}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Xuất biên bản thành công!", { id: "exportBienBan" });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi xuất file: " + (err.response?.data?.message || err.message), { id: "exportBienBan" });
    } finally {
      setExporting(false);
    }
  };

  // --- DUYỆT ---
  const handleDuyet = async () => {
    // 👇 3. Kiểm tra user trước khi gọi API
    if (!currentUserId) {
        toast.error("Lỗi phiên đăng nhập. Vui lòng đăng nhập lại!");
        return;
    }

    if (!window.confirm("Xác nhận PHÊ DUYỆT phiếu thanh lý này?")) return;

    setProcessing(true);
    try {
      const result = await thanhLyService.duyetPhieu(phieu.maPhieuThanhLy, currentUserId);
      setPhieu(result);
      toast.success("Phiếu đã được phê duyệt!");
      window.dispatchEvent(new Event("reloadThanhLyTable"));
    } catch (err) {
      // In lỗi chi tiết ra console
      console.error("Lỗi duyệt:", err); 
      // Hiển thị thông báo lỗi từ Backend trả về
      const msg = err.response?.data || err.message || "Lỗi không xác định";
      toast.error("Duyệt thất bại: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  // --- TỪ CHỐI ---
  const handleTuChoi = async () => {
    if (!currentUserId) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
    }

    const lyDo = window.prompt("Nhập lý do từ chối:", "Không đủ điều kiện thanh lý");
    if (!lyDo) return;

    setProcessing(true);
    try {
      const result = await thanhLyService.tuChoiPhieu(phieu.maPhieuThanhLy, currentUserId, lyDo);
      setPhieu(result);
      toast.success("Đã từ chối phiếu thanh lý");
      window.dispatchEvent(new Event("reloadThanhLyTable"));
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      console.error("Lỗi từ chối:", err);
      const msg = err.response?.data || err.message;
      toast.error("Từ chối thất bại: " + msg);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const isPending = phieu?.trangThai === "Chờ duyệt";
  const isCompleted = ["Hoàn tất", "HOAN_TAT", "Đã duyệt", "DA_DUYET"].includes(phieu?.trangThai);

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Chi tiết phiếu thanh lý: {phieu?.maPhieuThanhLy}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={processing} />
          </div>

          {loading ? (
            <div className="modal-body text-center py-5">Đang tải chi tiết...</div>
          ) : (
            <>
              <div className="modal-body">
                {/* Thông tin phiếu */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6"><strong>Số phiếu:</strong> <span className="fw-bold text-primary">{phieu?.soPhieu || phieu?.maPhieuThanhLy}</span></div>
                  <div className="col-md-6"><strong>Hình thức:</strong> {phieu?.hinhThuc}</div>
                  <div className="col-md-6"><strong>Người lập:</strong> <User size={16} className="me-1" /> {phieu?.tenNguoiTao}</div>
                  <div className="col-md-6"><strong>Ngày lập:</strong> <Calendar size={16} className="me-1" /> {formatDate(phieu?.ngayLap)}</div>
                  <div className="col-md-6"><strong>Tổng thiết bị:</strong> <span className="badge bg-primary fs-6">{phieu?.tongThietBi || phieu?.chiTiet?.length}</span></div>
                  <div className="col-md-6"><strong>Tổng thu về:</strong> <span className="text-success fw-bold fs-5">{formatCurrency(phieu?.tongGiaTriThuVe)}</span></div>
                  <div className="col-12"><strong>Lý do:</strong> {phieu?.lyDoThanhLy || "Không có"}</div>
                  <div className="col-12">
                    <strong>Trạng thái:</strong>{" "}
                    <span className={`badge fs-6 ${statusColors[phieu?.trangThai] || "bg-secondary"}`}>
                      {phieu?.trangThai}
                    </span>
                  </div>
                </div>

                {/* Bảng chi tiết */}
                {phieu?.chiTiet && phieu.chiTiet.length > 0 && (
                  <div className="border-top pt-4">
                    <h6 className="text-primary mb-3">Danh sách thiết bị thanh lý</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Mã TB</th>
                            <th>Tên thiết bị</th>
                            <th>Loại</th>
                            <th>Phòng</th>
                            <th>Nguyên giá</th>
                            <th>Còn lại</th>
                            <th>Thu về</th>
                            <th>Hình thức</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {phieu.chiTiet.map((ct, i) => (
                            <tr key={i}>
                              <td className="fw-semibold">{ct.maTb}</td>
                              <td>{ct.tenTb}</td>
                              <td>{ct.tenLoai}</td>
                              <td>{ct.tenPhong || "Chưa phân bổ"}</td>
                              <td>{formatCurrency(ct.nguyenGia)}</td>
                              <td>{formatCurrency(ct.giaTriConLai)}</td>
                              <td className="text-success fw-bold">{formatCurrency(ct.giaTriThuVe)}</td>
                              <td>{ct.hinhThucThanhLy}</td>
                              <td>
                                <span className={`badge ${
                                  ct.trangThai === "Đã duyệt" ? "bg-success" : 
                                  ct.trangThai === "Từ chối" ? "bg-danger" : 
                                  "bg-warning text-dark"
                                }`}>
                                  {ct.trangThai || "Chờ duyệt"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer border-top pt-3">
                <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={processing || exporting}>
                  Đóng
                </button>

                {/* NÚT XUẤT BIÊN BẢN */}
                {isCompleted && (
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={handleExportBienBan}
                        disabled={exporting}
                    >
                        {exporting ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
                        {exporting ? "Đang xuất..." : "Xuất biên bản"}
                    </button>
                )}

                {/* NÚT DUYỆT / TỪ CHỐI */}
                {isPending && canApprove && (
                  <>
                    <button
                      className="btn btn-danger d-flex align-items-center gap-2"
                      onClick={handleTuChoi}
                      disabled={processing}
                    >
                      <XCircle size={18} />
                      {processing ? "Đang xử lý..." : "Từ chối"}
                    </button>

                    <button
                      className="btn btn-success d-flex align-items-center gap-2"
                      onClick={handleDuyet}
                      disabled={processing}
                    >
                      <CheckCircle size={18} />
                      {processing ? "Đang duyệt..." : "Phê duyệt"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}