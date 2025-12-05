import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function EquipmentDisposalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [form, setForm] = useState({ lyDo: "", giaTriThanhLy: "" });

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

  const handleSubmit = async () => {
    try {
      // Giả lập gọi API thanh lý (bạn sẽ tạo sau)
      console.log("Đề xuất thanh lý:", { maTB: equipment.maTB, ...form });
      toast.success("Đã gửi đề xuất thanh lý thành công!");
      setIsOpen(false);
      // Có thể reload hoặc ẩn dòng nếu cần
    } catch (err) {
      toast.error("Lỗi khi gửi đề xuất");
    }
  };

  if (!isOpen || !equipment) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Đề xuất thanh lý</h5>
              <p className="text-muted mb-0 text-sm">
                Thiết bị: <strong>{equipment.tenTB}</strong> ({equipment.maTB})
              </p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Lý do thanh lý *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Mô tả lý do..."
                  value={form.lyDo}
                  onChange={(e) => setForm({ ...form, lyDo: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Giá trị thanh lý dự kiến (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={form.giaTriThanhLy}
                  onChange={(e) => setForm({ ...form, giaTriThanhLy: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <FileText size={16} className="me-2" />
              Gửi đề xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}