import { useState, useEffect } from "react";
import { Edit, Package, Calendar, DollarSign, User, CheckCircle, XCircle } from "lucide-react";
import thanhLyService from "../../services/disposalService";
import toast from "react-hot-toast";

const statusColors = {
  "Chờ duyệt": "bg-warning text-dark",
  "Hoàn tất": "bg-success",
  "Từ chối": "bg-danger",
};

export default function DisposalDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phieu, setPhieu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Giả sử bạn có thông tin người dùng hiện tại (sẽ lấy từ auth context sau)
  const currentUserId = "ND001"; // Thay bằng user thực tế

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

  // THÊM HÀM NÀY – BẮT BUỘC!
  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    try {
      // Nếu backend trả về dạng "2025-12-07" hoặc "07/12/2025"
      if (typeof dateStr === "string") {
        if (dateStr.includes("/")) return dateStr; // Đã đúng định dạng
        return new Date(dateStr).toLocaleDateString("vi-VN"); // Chuyển ISO → dd/MM/yyyy
      }
      return dateStr.toLocaleDateString("vi-VN");
    } catch (e) {
      return dateStr || "Không hợp lệ";
    }
  };

  const formatCurrency = (v) => v ? new Intl.NumberFormat("vi-VN").format(v) + " đ" : "0 đ";

  const handleDuyet = async () => {
    if (!window.confirm("Xác nhận PHÊ DUYỆT phiếu thanh lý này? Thiết bị sẽ được đánh dấu ĐÃ THANH LÝ")) return;

    setProcessing(true);
    try {
      const result = await thanhLyService.duyetPhieu(phieu.maPhieuThanhLy, currentUserId);
      setPhieu(result);
      toast.success("Phiếu đã được phê duyệt thành công!");

      // BẮN EVENT ĐỂ BẢNG TỰ ĐỘNG RELOAD
      window.dispatchEvent(new Event("reloadThanhLyTable"));
      
      // Đóng modal sau 1 giây để thấy hiệu ứng mượt
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      toast.error("Duyệt thất bại: " + (err.response?.data || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleTuChoi = async () => {
    const lyDo = window.prompt("Nhập lý do từ chối:", "Không đủ điều kiện thanh lý");
    if (!lyDo) return;

    setProcessing(true);
    try {
      const result = await thanhLyService.tuChoiPhieu(phieu.maPhieuThanhLy, currentUserId, lyDo);
      setPhieu(result);
      toast.success("Đã từ chối phiếu thanh lý");

      // BẮN EVENT RELOAD BẢNG
      window.dispatchEvent(new Event("reloadThanhLyTable"));
      
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      toast.error("Từ chối thất bại: " + (err.response?.data || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const openEdit = () => {
    setIsOpen(false);
    setTimeout(() => window.dispatchEvent(new Event("openEditThanhLyModal")), 300);
  };

  if (!isOpen) return null;

  const isPending = phieu?.trangThai === "Chờ duyệt";

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
                  <div className="col-md-6"><strong>Số phiếu:</strong> <span className="fw-bold text-primary">{phieu?.soPhieu}</span></div>
                  <div className="col-md-6"><strong>Hình thức:</strong> {phieu?.hinhThuc}</div>
                  <div className="col-md-6"><strong>Người lập:</strong> <User size={16} className="me-1" /> {phieu?.tenNguoiTao}</div>
                  <div className="col-md-6"><strong>Ngày lập:</strong> <Calendar size={16} className="me-1" /> {phieu?.ngayLap}</div>
                  <div className="col-md-6"><strong>Tổng thiết bị:</strong> <span className="badge bg-primary fs-6">{phieu?.tongThietBi}</span></div>
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
                            <th>Người duyệt</th>
                            <th>Ngày thanh lý</th>
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
                                  "bg-warning"
                                }`}>
                                  {ct.trangThai || "Chờ duyệt"}
                                </span>
                              </td>
                              <td>{ct.tenNguoiDuyet || "-"}</td>
                              <td>{ct.ngayThanhLy ? formatDate(ct.ngayThanhLy) : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer với nút hành động */}
              <div className="modal-footer border-top pt-3">
                <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={processing}>
                  Đóng
                </button>

                {/* Chỉ hiện khi đang chờ duyệt */}
                {isPending && (
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

                {/* Chỉnh sửa chỉ hiện khi chờ duyệt */}
                {/* {isPending && (
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={openEdit}
                    disabled={processing}
                  >
                    <Edit size={16} />
                    Chỉnh sửa
                  </button>
                )} */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}