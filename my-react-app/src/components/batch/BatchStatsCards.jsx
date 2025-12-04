import { Package, CheckCircle } from "lucide-react";

export default function BatchStatsCards() {
  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tổng lô thiết bị</h6>
              <Package size={20} className="text-primary" />
            </div>
            <h2 className="mb-2">24</h2>
            <p className="text-xs text-muted mb-0">Trong năm 2024</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tổng thiết bị</h6>
              <CheckCircle size={20} style={{ color: "#10b981" }} />
            </div>
            <h2 className="mb-2">1,245</h2>
            <p className="text-xs text-muted mb-0">Đã được sinh từ lô</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Giá trị tổng</h6>
              <Package size={20} className="text-primary" />
            </div>
            <h2 className="mb-2">42.5 tỷ</h2>
            <p className="text-xs text-muted mb-0">Tổng nguyên giá các lô</p>
          </div>
        </div>
      </div>
    </div>
  );
}