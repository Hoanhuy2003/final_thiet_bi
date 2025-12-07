import { useState, useEffect } from "react";
import { Edit, Package, Calendar, DollarSign, Building2, AlertCircle } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success",
  "Bảo trì": "bg-warning",
  "Hỏng hóc": "bg-danger",
  "Chờ thanh lý": "bg-secondary",
};

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      // 1. Lấy dữ liệu sơ bộ từ LocalStorage (do trang danh sách gửi sang)
      const dataStr = localStorage.getItem("selectedEquipment");
      
      if (dataStr) {
        const eqBasic = JSON.parse(dataStr);
        setEquipment(eqBasic); // Hiển thị tạm để người dùng không phải chờ
        setIsOpen(true);
        setLoading(true);

        try {
          // 2. Gọi API lấy chi tiết đầy đủ (Lịch sử, thông tin sâu)
          const res = await equipmentService.getById(eqBasic.maTB);
          
          // Kiểm tra cấu trúc trả về: res.data hay res trực tiếp
          const detailData = res.data || res;
          
          console.log("Chi tiết thiết bị từ API:", detailData); // Log để kiểm tra
          setEquipment(detailData); 

        } catch (err) {
          console.warn("Không lấy được chi tiết mới nhất, dùng dữ liệu cũ:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("openDetailEquipmentModal", handler);
    return () => window.removeEventListener("openDetailEquipmentModal", handler);
  }, []);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "...";
    return new Intl.NumberFormat("vi-VN", { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "...";
    // Xử lý trường hợp chuỗi ngày dạng mảng [2025, 12, 06] từ Java
    if (Array.isArray(dateStr)) return `${dateStr[2]}/${dateStr[1]}/${dateStr[0]}`;
    return dateStr.includes("-") ? new Date(dateStr).toLocaleDateString("vi-VN") : dateStr;
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Package size={20} />
              Chi tiết: {equipment?.tenTB || "Thiết bị"}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>

          <div className="modal-body">
            {loading && <div className="text-center py-2 text-muted small">Đang cập nhật dữ liệu mới nhất...</div>}
            
            <div className="row g-4 mb-4">
              {/* Mã TB */}
              <div className="col-md-6">
                <div className="text-muted small fw-bold text-uppercase">Mã quản lý</div>
                <div className="fs-5 fw-bold text-dark">{equipment?.maTB || "N/A"}</div>
              </div>
              
              {/* Tên TB */}
              <div className="col-md-6">
                <div className="text-muted small fw-bold text-uppercase">Tên thiết bị</div>
                <div className="fs-5 fw-bold text-primary">{equipment?.tenTB}</div>
              </div>

              {/* === PHẦN QUAN TRỌNG: XỬ LÝ DỮ LIỆU LỒNG NHAU (NESTED OBJECT) === */}
              
              {/* Loại thiết bị */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <Package size={16} /> <strong>Loại thiết bị:</strong>
                </div>
                {/* Ưu tiên lấy từ object loaiThietBi (API), nếu không có thì lấy chuỗi loai (Table) */}
                <div>{equipment?.loaiThietBi?.tenLoai || equipment?.tenLoai || equipment?.loai || "---"}</div>
              </div>

              {/* Phòng / Vị trí */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <Building2 size={16} /> <strong>Vị trí đặt:</strong>
                </div>
                {/* Ưu tiên lấy từ object phong (API), fallback về chuỗi phong */}
                <div>{equipment?.phong?.tenPhong || equipment?.tenPhong || equipment?.phong || "Kho chung"}</div>
              </div>

              {/* Lô nhập */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <strong>Thuộc Lô:</strong>
                </div>
                <div>{equipment?.loThietBi?.tenLo || equipment?.tenLo || equipment?.lo || "Lô lẻ / Mua rời"}</div>
              </div>

              {/* Trạng thái */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <AlertCircle size={16} /> <strong>Trạng thái:</strong>
                </div>
                <span className={`badge ${statusColors[equipment?.tinhTrang] || "bg-secondary"}`}>
                  {equipment?.tinhTrang || "Chưa cập nhật"}
                </span>
              </div>

              {/* Giá trị */}
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <DollarSign size={16} /> <strong>Nguyên giá:</strong>
                </div>
                <div className="fw-bold text-success">{formatCurrency(equipment?.giaTriBanDau)}</div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 text-muted mb-1">
                   <DollarSign size={16} /> <strong>Giá trị còn lại:</strong>
                </div>
                <div className="fw-bold text-primary">{formatCurrency(equipment?.giaTriHienTai)}</div>
              </div>
            </div>

            {/* === PHẦN LỊCH SỬ HOẠT ĐỘNG (Kiểm tra kỹ tên trường trả về) === */}
            <div className="border-top pt-3 mt-3">
              <h6 className="text-primary fw-bold mb-3">Lịch sử thiết bị</h6>
              
              {/* Kiểm tra cả 2 tên trường phổ biến: lichSuThietBis (JPA default) hoặc history */}
              {(equipment?.lichSuThietBis || equipment?.lichSuHoatDong || []).length > 0 ? (
                <div className="timeline ps-2 border-start border-2 border-light">
                  {(equipment?.lichSuThietBis || equipment?.lichSuHoatDong).map((ls, i) => (
                    <div key={i} className="mb-3 ms-3 position-relative">
                      <div className="position-absolute top-0 start-0 translate-middle rounded-circle bg-primary" 
                           style={{width: '10px', height: '10px', left: '-22px'}}></div>
                      
                      <p className="mb-1 fw-semibold small">
                        {ls.ghiChu || `Cập nhật trạng thái: ${ls.trangThaiMoi}`}
                      </p>
                      <small className="text-muted fst-italic">
                        {formatDate(ls.ngayThayDoi)} 
                        {ls.nguoiDung && ` - Bởi: ${ls.nguoiDung.tenND}`}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center small py-3">Chưa có lịch sử hoạt động nào.</p>
              )}
            </div>
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