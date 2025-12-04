import { useState, useEffect } from "react";

export default function ProcurementCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateProcurementModal", handler);
    return () => window.removeEventListener("openCreateProcurementModal", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tạo đề xuất mua sắm</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Tên đề xuất *</label>
                <input type="text" className="form-control" placeholder="VD: Mua sắm máy tính cho phòng Lab" />
              </div>
              <div className="col-6">
                <label className="form-label">Loại thiết bị *</label>
                <select className="form-select">
                  <option value="">Chọn loại</option>
                  <option>Máy tính</option>
                  <option>Thiết bị thí nghiệm</option>
                  <option>Nội thất</option>
                  <option>Máy chiếu</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Số lượng *</label>
                <input type="number" className="form-control" placeholder="Nhập số lượng" />
              </div>
              <div className="col-6">
                <label className="form-label">Đơn vị *</label>
                <select className="form-select">
                  <option value="">Chọn đơn vị</option>
                  <option>Khoa CNTT</option>
                  <option>Khoa Cơ khí</option>
                  <option>Khoa Điện tử</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Giá trị dự kiến</label>
                <input type="number" className="form-control" placeholder="Nhập giá trị (VNĐ)" />
              </div>
              <div className="col-12">
                <label className="form-label">Lý do mua sắm *</label>
                <textarea className="form-control" rows="3" placeholder="Nhập lý do chi tiết..."></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Tạo đề xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}