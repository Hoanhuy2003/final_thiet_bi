import { useState, useEffect } from "react";
import { Edit, Package, Calendar, DollarSign, Building2, AlertCircle } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

// Màu trạng thái đẹp
const statusColors = {
  "Đang sử dụng": "bg-success",
  "Bảo trì": "bg-warning",
  "Hỏng hóc": "bg-danger",
  "Chờ thanh lý": "bg-secondary",
};

const statusTextColor = {
  "Đang sử dụng": "text-success",
  "Bảo trì": "text-warning",
  "Hỏng hóc": "text-danger",
  "Chờ thanh lý": "text-secondary",
};

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      const data = localStorage.getItem("selectedEquipment");
      if (data) {
        const eq = JSON.parse(data);
        setLoading(true);
        try {
          const detail = await equipmentService.getById(eq.maTB);
          setEquipment(detail);
        } catch (err) {
          console.warn("Lỗi lấy chi tiết thiết bị, dùng dữ liệu bảng:", err);
          setEquipment(eq); // Fallback về dữ liệu từ bảng
          toast.error("Không tải được lịch sử hoạt động");
        } finally {
          setLoading(false);
        }
        setIsOpen(true);
      }
    };

    window.addEventListener("openDetailEquipmentModal", handler);
    return () => window.removeEventListener("openDetailEquipmentModal", handler);
  }, []);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "Chưa xác định";
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    // Nếu backend trả dd/MM/yyyy thì giữ nguyên, nếu là ISO thì format
    return dateStr.includes("/") ? dateStr : new Date(dateStr).toLocaleDateString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Chi tiết thiết bị: {equipment?.maTB || "..."}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
            />
          </div>

          {loading ? (
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải chi tiết thiết bị...</p>
            </div>
          ) : (
            <>
              <div className="modal-body">
                {/* Thông tin chính */}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <strong>Mã thiết bị:</strong>
                    </div>
                    <h5 className="mt-1">{equipment?.maTB || "N/A"}</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <strong>Tên thiết bị:</strong>
                    </div>
                    <h5 className="mt-1">{equipment?.tenTB || "Chưa đặt tên"}</h5>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <Package size={16} /> <strong>Lô:</strong>
                    </div>
                    <p className="mt-1 mb-0">{equipment?.lo || "Chưa thuộc lô nào"}</p>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <strong>Loại:</strong>
                    </div>
                    <p className="mt-1 mb-0">{equipment?.loai || "Chưa xác định"}</p>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <Building2 size={16} /> <strong>Phòng:</strong>
                    </div>
                    <p className="mt-1 mb-0">{equipment?.phong || "Chưa phân bổ"}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <AlertCircle size={16} /> <strong>Trạng thái:</strong>
                    </div>
                    <span
                      className={`badge fs-6 ${
                        statusColors[equipment?.tinhTrang] || "bg-secondary"
                      }`}
                    >
                      {equipment?.tinhTrang || "Không rõ"}
                    </span>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <Calendar size={16} /> <strong>Ngày sử dụng:</strong>
                    </div>
                    <p className="mt-1 mb-0">{formatDate(equipment?.ngaySuDung)}</p>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-success">
                      <DollarSign size={16} /> <strong>Nguyên giá:</strong>
                    </div>
                    <h6 className="mt-1 text-success fw-bold">
                      {formatCurrency(equipment?.giaTriBanDau)}
                    </h6>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-primary">
                      <DollarSign size={16} /> <strong>Giá trị hiện tại:</strong>
                    </div>
                    <h6 className="mt-1 text-primary fw-bold">
                      {formatCurrency(equipment?.giaTriHienTai)}
                    </h6>
                  </div>
                </div>

                {/* Lịch sử hoạt động */}
                {equipment?.lichSuHoatDong && equipment.lichSuHoatDong.length > 0 && (
                  <div className="border-top pt-4 mt-4">
                    <h6 className="text-primary mb-3">
                      Lịch sử hoạt động
                    </h6>
                    <div className="timeline">
                      {equipment.lichSuHoatDong.map((ls, i) => (
                        <div key={i} className="d-flex gap-3 py-3 border-bottom last:border-0">
                          <div className="text-primary fw-bold">•</div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-semibold">{ls.noiDung || "Cập nhật thông tin"}</p>
                            <small className="text-muted d-flex align-items-center gap-2">
                              <Calendar size={14} />
                              {formatDate(ls.ngayThayDoi)}
                              {" • "}
                              {ls.nguoiThucHien || "Hệ thống"}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!equipment?.lichSuHoatDong || equipment.lichSuHoatDong.length === 0 && (
                  <div className="text-center text-muted py-4 border-top mt-4">
                    <p>Chưa có lịch sử hoạt động</p>
                  </div>
                )}
              </div>

              <div className="modal-footer border-top">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </button>
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => {
                    setIsOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new Event("openEditEquipmentModal"));
                    }, 300); // Đảm bảo modal cũ đóng xong mới mở edit
                  }}
                >
                  <Edit size={16} />
                  Chỉnh sửa thiết bị
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}