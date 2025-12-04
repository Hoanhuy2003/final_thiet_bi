// components/dashboard/StatsCards.jsx
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export function StatsCards() {
  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <div className="bg-primary text-white rounded-3 p-3">
                <Package size={28} />
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-1">Tổng thiết bị</h6>
              <h3 className="mb-0">1,248</h3>
              <small className="text-success">+12.5% tháng trước</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <div className="bg-success text-white rounded-3 p-3">
                <CheckCircle size={28} />
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-1">Đang hoạt động</h6>
              <h3 className="mb-0">1,085</h3>
              <small className="text-muted">87% tổng số</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <div className="bg-warning text-white rounded-3 p-3">
                <AlertTriangle size={28} />
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-1">Cần bảo trì</h6>
              <h3 className="mb-0">42</h3>
              <small className="text-danger">8 quá hạn</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <div className="bg-info text-white rounded-3 p-3">
                <TrendingUp size={28} />
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-1">Giá trị tài sản</h6>
              <h3 className="mb-0">45.2 tỷ</h3>
              <small className="text-muted">Sau khấu hao</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}