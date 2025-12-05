import { useState, useEffect } from "react";

export default function EquipmentEditModal() {
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
    window.addEventListener("openEditModal", handler);
    return () => window.removeEventListener("openEditModal", handler);
  }, []);

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Chỉnh sửa thiết bị</h5>
              <p className="text-muted mb-0 text-sm">Cập nhật thông tin thiết bị {equipment.ma_tai_san}</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Tên thiết bị</label>
                <input type="text" className="form-control" defaultValue={equipment.ten_thiet_bi} />
              </div>
              <div className="col-6">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" defaultValue={equipment.trang_thai}>
                  <option value="Đang sử dụng">Đang sử dụng</option>
                  <option value="Bảo trì">Bảo trì</option>
                  <option value="Hỏng hóc">Hỏng hóc</option>
                  <option value="Chờ thanh lý">Chờ thanh lý</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Đơn vị</label>
                <select className="form-select" defaultValue={equipment.don_vi}>
                  <option value="Khoa CNTT">Khoa CNTT</option>
                  <option value="Khoa Cơ khí">Khoa Cơ khí</option>
                  <option value="Khoa Điện tử">Khoa Điện tử</option>
                  <option value="Khoa Kinh tế">Khoa Kinh tế</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Phòng</label>
                <input type="text" className="form-control" defaultValue={equipment.phong} />
              </div>
              <div className="col-12">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows="3" placeholder="Nhập ghi chú..."></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
}