import { Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function DisposalStatsCards() {
  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Chờ duyệt</h6>
              <Clock size={20} style={{ color: "#f59e0b" }} />
            </div>
            <h2 className="mb-0">8</h2>
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
            <h2 className="mb-0">24</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Từ chối</h6>
              <XCircle size={20} style={{ color: "#dc2626" }} />
            </div>
            <h2 className="mb-0">3</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Giá trị thu hồi</h6>
              <Trash2 size={20} className="text-primary" />
            </div>
            <h2 className="mb-0">125M</h2>
          </div>
        </div>
      </div>
    </div>
  );
}