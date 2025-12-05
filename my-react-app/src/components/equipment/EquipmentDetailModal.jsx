import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

const statusColors = {
  "Đang sử dụng": "badge-success",
  "Bảo trì": "badge-warning",
  "Hỏng hóc": "badge-danger",
  "Chờ thanh lý": "badge-secondary",
};

export default function EquipmentDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedEquipment");
      if (data) {
        setEquipment(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailModal", handler);
    return () => window.removeEventListener("openDetailModal", handler);
  }, []);

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Chi tiết thiết bị</h5>
              <p className="text-muted mb-0 text-sm">
                Thông tin chi tiết về thiết bị {equipment.ma_tai_san}
              </p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-6"><label className="form-label mb-1">Mã tài sản</label><p className="mb-0">{equipment.ma_tai_san}</p></div>
              <div className="col-6"><label className="form-label mb-1">Tên thiết bị</label><p className="mb-0">{equipment.ten_thiet_bi}</p></div>
              <div className="col-6"><label className="form-label mb-1">Loại thiết bị</label><p className="mb-0">{equipment.loai}</p></div>
              <div className="col-6"><label className="form-label mb-1">Trạng thái</label><span className={`badge ${statusColors[equipment.trang_thai]}`}>{equipment.trang_thai}</span></div>
              <div className="col-6"><label className="form-label mb-1">Đơn vị quản lý</label><p className="mb-0">{equipment.don_vi}</p></div>
              <div className="col-6"><label className="form-label mb-1">Phòng</label><p className="mb-0">{equipment.phong}</p></div>
              <div className="col-6"><label className="form-label mb-1">Ngày mua</label><p className="mb-0">{equipment.ngay_mua}</p></div>
              <div className="col-6"><label className="form-label mb-1">Nguyên giá</label><p className="mb-0">{equipment.nguyen_gia.toLocaleString("vi-VN")}đ</p></div>
              <div className="col-6"><label className="form-label mb-1">Giá trị còn lại</label><p className="mb-0">{equipment.gia_tri_con_lai.toLocaleString("vi-VN")}đ</p></div>
            </div>
            <div className="border-top pt-3">
              <h6 className="mb-3">Lịch sử hoạt động</h6>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex gap-2 align-items-start text-sm">
                  <div className="rounded-circle mt-1" style={{ width: "8px", height: "8px", backgroundColor: "var(--primary-color)" }} />
                  <div><p className="mb-0">Nhập kho - {equipment.ngay_mua}</p><p className="text-muted mb-0 text-xs">Bởi: Nguyễn Văn A</p></div>
                </div>
                <div className="d-flex gap-2 align-items-start text-sm">
                  <div className="rounded-circle mt-1" style={{ width: "8px", height: "8px", backgroundColor: "var(--primary-color)" }} />
                  <div><p className="mb-0">Bàn giao cho {equipment.don_vi}</p><p className="text-muted mb-0 text-xs">Bởi: Trần Thị B</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
            <button className="btn btn-primary" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event("openEditModal")); }}>
              <Edit size={16} className="me-2" />Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}