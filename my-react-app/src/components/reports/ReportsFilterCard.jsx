import { useState } from "react";
import { Filter } from "lucide-react";

export default function ReportsFilterCard() {
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0 d-flex align-items-center gap-2">
          <Filter size={20} />
          Bộ lọc báo cáo
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label">Từ ngày</label>
            <input
              type="date"
              className="form-control"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Đến ngày</label>
            <input
              type="date"
              className="form-control"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Đơn vị</label>
            <select className="form-select">
              <option value="">Tất cả đơn vị</option>
              <option>Khoa CNTT</option>
              <option>Khoa Cơ khí</option>
              <option>Khoa Điện tử</option>
              <option>Khoa Kinh tế</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-end">
          <button className="btn btn-primary">
            <Filter size={16} className="me-2" />
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}