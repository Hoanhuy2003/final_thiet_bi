// src/components/inventory/InventoryDetailModal.jsx
import { useState, useEffect } from "react";

export default function InventoryDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedInventorySession");
      if (data) {
        setSession(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailInventoryModal", handler);
    return () => window.removeEventListener("openDetailInventoryModal", handler);
  }, []);

  if (!isOpen || !session) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">Chi tiết phiên kiểm kê - {session.ma_kiem_ke}</h5>
              <p className="text-muted mb-0 text-sm">Thông tin chi tiết về phiên kiểm kê</p>
            </div>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label mb-1">Mã kiểm kê</label>
                <p className="mb-0">{session.ma_kiem_ke}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Phòng</label>
                <p className="mb-0">{session.phong}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Đơn vị</label>
                <p className="mb-0">{session.don_vi}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Người kiểm kê</label>
                <p className="mb-0">{session.nguoi_kiem_ke}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Ngày kiểm kê</label>
                <p className="mb-0">{session.ngay_kiem_ke}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Tổng thiết bị</label>
                <p className="mb-0">{session.tong_thiet_bi}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Đã kiểm</label>
                <p className="mb-0">{session.da_kiem}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Tồn tại</label>
                <p className="mb-0">{session.ton_tai}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Mất</label>
                <p className="mb-0">{session.mat}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Hỏng</label>
                <p className="mb-0">{session.hong}</p>
              </div>
              <div className="col-6">
                <label className="form-label mb-1">Trạng thái</label>
                <p className="mb-0">{session.trang_thai}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}