import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function InventoryCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateInventoryModal", handler);
    return () => window.removeEventListener("openCreateInventoryModal", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Tạo phiên kiểm kê mới</h5>
              <p className="text-muted mb-0 text-sm">
                Nhập thông tin để bắt đầu một phiên kiểm kê thiết bị
              </p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Đơn vị *</label>
                <select className="form-select">
                  <option value="">Chọn đơn vị</option>
                  <option>Khoa CNTT</option>
                  <option>Khoa Cơ khí</option>
                  <option>Khoa Điện tử</option>
                  <option>Khoa Kinh tế</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Phòng *</label>
                <select className="form-select">
                  <option value="">Chọn phòng</option>
                  <option>Lab A101</option>
                  <option>Phòng 203</option>
                  <option>Lab B205</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Ngày kiểm kê *</label>
                <input type="date" className="form-control" defaultValue="2024-06-25" />
              </div>
              <div className="col-6">
                <label className="form-label">Người kiểm kê *</label>
                <select className="form-select">
                  <option value="">Chọn người kiểm kê</option>
                  <option>Nguyễn Văn A</option>
                  <option>Trần Thị B</option>
                  <option>Lê Văn C</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows="3" placeholder="Nhập ghi chú..."></textarea>
              </div>
            </div>
            <div className="border rounded p-3 bg-light mt-3">
              <p className="text-sm mb-0">
                <strong>Lưu ý:</strong> Hệ thống sẽ tự động tải danh sách thiết bị trong phòng được chọn.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              <Plus size={16} className="me-2" />
              Tạo phiên kiểm kê
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}