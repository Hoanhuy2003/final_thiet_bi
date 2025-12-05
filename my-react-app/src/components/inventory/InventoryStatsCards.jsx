import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function InventoryStatsCards() {
  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tổng phiên kiểm kê</h6>
              <ClipboardCheck size={20} className="text-primary" />
            </div>
            <h2 className="mb-2">18</h2>
            <p className="text-xs text-muted mb-0">Trong năm 2024</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Đã kiểm tra</h6>
              <CheckCircle size={20} style={{ color: "#10b981" }} />
            </div>
            <h2 className="mb-2">1,085</h2>
            <p className="text-xs text-muted mb-0">Thiết bị đã kiểm kê</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Mất/Hỏng</h6>
              <XCircle size={20} style={{ color: "#dc2626" }} />
            </div>
            <h2 className="mb-2">12</h2>
            <p className="text-xs text-muted mb-0">Phát hiện sự cố</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tỷ lệ chính xác</h6>
              <AlertTriangle size={20} style={{ color: "#10b981" }} />
            </div>
            <h2 className="mb-2">98.9%</h2>
            <p className="text-xs text-muted mb-0">So với sổ sách</p>
          </div>
        </div>
      </div>
    </div>
  );
}