import { useState, useEffect } from "react";
import { Plus, Zap } from "lucide-react";

export default function BatchCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [form, setForm] = useState({
    ten_lo: "",
    loai_thiet_bi: "",
    so_luong: "",
    nguyen_gia: "",
    don_vi: "",
    ghi_chu: "",
  });

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateBatchModal", handler);
    return () => window.removeEventListener("openCreateBatchModal", handler);
  }, []);

  const handleSubmit = () => {
    console.log("Tạo lô:", { ...form, autoGenerate });
    setIsOpen(false);
    setForm({ ten_lo: "", loai_thiet_bi: "", so_luong: "", nguyen_gia: "", don_vi: "", ghi_chu: "" });
  };

  const totalValue = form.so_luong && form.nguyen_gia
    ? (parseInt(form.so_luong) * parseInt(form.nguyen_gia)).toLocaleString("vi-VN")
    : null;

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Tạo lô thiết bị mới</h5>
              <p className="text-muted mb-0 text-sm">
                Nhập thông tin lô thiết bị và hệ thống sẽ tự động sinh mã tài sản
              </p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            {/* Form fields giống hệt bản gốc */}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Tên lô thiết bị *</label>
                <input type="text" className="form-control" placeholder="VD: Lô máy tính Dell cho Khoa CNTT"
                  value={form.ten_lo} onChange={(e) => setForm({ ...form, ten_lo: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Loại thiết bị *</label>
                <select className="form-select" value={form.loai_thiet_bi}
                  onChange={(e) => setForm({ ...form, loai_thiet_bi: e.target.value })}>
                  <option value="">Chọn loại thiết bị</option>
                  <option value="may-tinh">Máy tính</option>
                  <option value="may-chieu">Máy chiếu</option>
                  <option value="thiet-bi-thi-nghiem">Thiết bị thí nghiệm</option>
                  <option value="noi-that">Nội thất</option>
                  <option value="thiet-bi-van-phong">Thiết bị văn phòng</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Số lượng *</label>
                <input type="number" className="form-control" placeholder="VD: 25"
                  value={form.so_luong} onChange={(e) => setForm({ ...form, so_luong: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Nguyên giá đơn vị *</label>
                <input type="number" className="form-control" placeholder="VD: 18500000"
                  value={form.nguyen_gia} onChange={(e) => setForm({ ...form, nguyen_gia: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Đơn vị nhận *</label>
                <select className="form-select" value={form.don_vi}
                  onChange={(e) => setForm({ ...form, don_vi: e.target.value })}>
                  <option value="">Chọn đơn vị</option>
                  <option value="khoa-cntt">Khoa CNTT</option>
                  <option value="khoa-co-khi">Khoa Cơ khí</option>
                  <option value="khoa-dien-tu">Khoa Điện tử</option>
                  <option value="khoa-kinh-te">Khoa Kinh tế</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Ghi chú</label>
                <textarea className="form-control" rows="3" placeholder="Nhập ghi chú..."
                  value={form.ghi_chu} onChange={(e) => setForm({ ...form, ghi_chu: e.target.value })}></textarea>
              </div>
            </div>

            <div className="border rounded p-3 bg-light mt-3">
              <div className="d-flex gap-3 align-items-start">
                <input type="checkbox" className="form-check-input mt-1" checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)} />
                <div>
                  <label className="form-check-label d-flex align-items-center gap-2 mb-1" style={{ cursor: "pointer" }}>
                    <Zap size={16} className="text-primary" />
                    <span>Tự động sinh mã tài sản cho thiết bị</span>
                  </label>
                  <p className="text-sm text-muted mb-0">
                    Hệ thống sẽ tự động tạo {form.so_luong || "N"} thiết bị với mã TB-2024-XXX
                  </p>
                </div>
              </div>
            </div>

            {totalValue && (
              <div className="border rounded p-3 mt-3" style={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Tổng giá trị lô:</span>
                  <span className="font-semibold">{totalValue}đ</span>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Plus size={16} className="me-2" />
              Tạo lô thiết bị
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}