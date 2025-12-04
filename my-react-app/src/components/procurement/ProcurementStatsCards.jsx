import { Clock, CheckCircle, ShoppingCart } from "lucide-react";

export default function ProcurementStatsCards() {
  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Chờ duyệt</h6>
              <Clock size={20} style={{ color: "#f59e0b" }} />
            </div>
            <h2 className="mb-0">12</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Đã duyệt</h6>
              <CheckCircle size={20} style={{ color: "#10b981" }} />
            </div>
            <h2 className="mb-0">35</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Đang mua sắm</h6>
              <ShoppingCart size={20} className="text-primary" />
            </div>
            <h2 className="mb-0">8</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tổng giá trị</h6>
              <ShoppingCart size={20} className="text-primary" />
            </div>
            <h2 className="mb-0">8.5 tỷ</h2>
          </div>
        </div>
      </div>
    </div>
  );
}