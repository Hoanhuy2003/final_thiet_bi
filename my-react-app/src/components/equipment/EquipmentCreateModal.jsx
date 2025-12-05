// src/components/equipment/EquipmentCreateModal.jsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function EquipmentCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateEquipmentModal", handler);
    return () => window.removeEventListener("openCreateEquipmentModal", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Thêm thiết bị mới</h5>
              <p className="text-muted mb-0 text-sm">Nhập thông tin thiết bị để thêm vào hệ thống</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label htmlFor="create-name" className="form-label">Tên thiết bị *</label>
                <input
                  type="text"
                  className="form-control"
                  id="create-name"
                  placeholder="Nhập tên thiết bị..."
                />
              </div>
              <div className="col-6">
                <label htmlFor="create-category" className="form-label">Danh mục *</label>
                <select className="form-select" id="create-category">
                  <option value="">Chọn danh mục</option>
                  <option>Máy tính</option>
                  <option>Thiết bị dạy học</option>
                  <option>Máy công cụ</option>
                  <option>Thiết bị văn phòng</option>
                  <option>Thiết bị thí nghiệm</option>
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="create-department" className="form-label">Đơn vị *</label>
                <select className="form-select" id="create-department">
                  <option value="">Chọn đơn vị</option>
                  <option>Khoa CNTT</option>
                  <option>Khoa Cơ khí</option>
                  <option>Khoa Điện tử</option>
                  <option>Khoa Kinh tế</option>
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="create-room" className="form-label">Phòng</label>
                <input
                  type="text"
                  className="form-control"
                  id="create-room"
                  placeholder="Nhập phòng..."
                />
              </div>
              <div className="col-6">
                <label htmlFor="create-purchase-date" className="form-label">Ngày mua *</label>
                <input
                  type="date"
                  className="form-control"
                  id="create-purchase-date"
                />
              </div>
              <div className="col-6">
                <label htmlFor="create-original-price" className="form-label">Nguyên giá *</label>
                <input
                  type="number"
                  className="form-control"
                  id="create-original-price"
                  placeholder="Nhập nguyên giá..."
                />
              </div>
              <div className="col-6">
                <label htmlFor="create-status" className="form-label">Trạng thái ban đầu *</label>
                <select className="form-select" id="create-status">
                  <option value="">Chọn trạng thái</option>
                  <option>Đang sử dụng</option>
                  <option>Bảo trì</option>
                  <option>Hỏng hóc</option>
                  <option>Chờ thanh lý</option>
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="create-warranty" className="form-label">Thời gian bảo hành (tháng)</label>
                <input
                  type="number"
                  className="form-control"
                  id="create-warranty"
                  placeholder="Nhập thời gian bảo hành..."
                  min="0"
                />
              </div>
              <div className="col-12">
                <label htmlFor="create-note" className="form-label">Ghi chú</label>
                <textarea
                  className="form-control"
                  id="create-note"
                  rows="3"
                  placeholder="Nhập ghi chú thêm về thiết bị..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Lưu thiết bị
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}