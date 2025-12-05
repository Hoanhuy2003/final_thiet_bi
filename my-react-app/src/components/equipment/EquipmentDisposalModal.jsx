import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

export default function EquipmentDisposalModal() {
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
    window.addEventListener("openDisposalModal", handler);
    return () => window.removeEventListener("openDisposalModal", handler);
  }, []);

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Đề xuất thanh lý</h5>
              <p className="text-muted mb-0 text-sm">Tạo đề xuất thanh lý cho thiết bị {equipment.ma_tai_san}</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Thiết bị</label>
                <p className="mb-0">{equipment.ten_thiet_bi}</p>
              </div>
              <div>
                <label className="form-label">Lý do thanh lý</label>
                <textarea className="form-control" rows="3" placeholder="Nhập lý do thanh lý thiết bị..."></textarea>
              </div>
              <div>
                <label className="form-label">Giá trị thanh lý dự kiến</label>
                <input type="number" className="form-control" placeholder="Nhập giá trị..." />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={() => setIsOpen(false)}>
              <FileText size={16} className="me-2" />
              Tạo đề xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}