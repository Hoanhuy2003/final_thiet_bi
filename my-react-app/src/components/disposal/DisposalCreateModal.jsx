import { useState, useEffect } from "react";

export default function DisposalCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateDisposalModal", handler);
    return () => window.removeEventListener("openCreateDisposalModal", handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tạo đề xuất thanh lý</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Thiết bị cần thanh lý *</label>
                <select className="form-select">
                  <option value="">Chọn thiết bị</option>
                  <option>TB-2018-023 - Máy chiếu Sony</option>
                  <option>TB-2019-045 - Máy in HP</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Hình thức thanh lý *</label>
                <select className="form-select">
                  <option>Bán</option>
                  <option>Hủy</option>
                  <option>Điều chuyển</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Giá trị dự kiến</label>
                <input type="number" className="form-control" placeholder="Nhập giá trị..." />
              </div>
              <div className="col-12">
                <label className="form-label">Lý do thanh lý *</label>
                <textarea className="form-control" rows="3" placeholder="Nhập lý do..."></textarea>
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