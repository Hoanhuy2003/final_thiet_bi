import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { deXuatMuaService } from "../../services/deXuatMuaService";

export default function ProcurementStatsCards() {
  const [stats, setStats] = useState({
    choDuyet: 0,
    daDuyet: 0,
    tuChoi: 0, // Thay Hoàn thành bằng Từ chối
    tongTien: 0
  });

  const calculateStats = (data) => {
    const newStats = data.reduce((acc, item) => {
      // 1. Cộng tổng tiền
      acc.tongTien += Number(item.tongTien) || 0;

      // 2. Đếm trạng thái (Check cả Mã và Tiếng Việt cho chắc)
      const status = item.trangThai;
      
      if (status === "Chờ duyệt" || status === "CHO_DUYET") {
        acc.choDuyet += 1;
      } else if (status === "Đã duyệt" || status === "DA_DUYET") {
        acc.daDuyet += 1;
      } else if (status === "Từ chối" || status === "TU_CHOI") {
        acc.tuChoi += 1;
      }
      
      return acc;
    }, { choDuyet: 0, daDuyet: 0, tuChoi: 0, tongTien: 0 });

    setStats(newStats);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await deXuatMuaService.getAll();
        const data = res.data?.result || res.data || res || [];
        if (Array.isArray(data)) {
          calculateStats(data);
        }
      } catch (err) {
        console.error("Lỗi thống kê:", err);
      }
    };

    fetchData();

    const handler = () => fetchData();
    window.addEventListener("procurementFilterChange", handler);
    return () => window.removeEventListener("procurementFilterChange", handler);
  }, []);

  const formatCompactMoney = (amount) => {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1).replace(".0", "") + " tỷ";
    }
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(0) + " tr";
    }
    return amount.toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="row g-4 mb-4">
      {/* 1. Chờ duyệt */}
      <div className="col-12 col-md-3">
        <div className="card shadow-sm border-0 border-start border-4 border-warning h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Chờ duyệt</h6>
              <div className="p-2 bg-warning bg-opacity-10 rounded-circle">
                <Clock size={20} className="text-warning" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.choDuyet}</h2>
          </div>
        </div>
      </div>

      {/* 2. Đã duyệt */}
      <div className="col-12 col-md-3">
        <div className="card shadow-sm border-0 border-start border-4 border-success h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Đã duyệt</h6>
              <div className="p-2 bg-success bg-opacity-10 rounded-circle">
                <CheckCircle size={20} className="text-success" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.daDuyet}</h2>
          </div>
        </div>
      </div>

      {/* 3. Từ chối (Thay cho Hoàn thành) */}
      <div className="col-12 col-md-3">
        <div className="card shadow-sm border-0 border-start border-4 border-danger h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Từ chối</h6>
              <div className="p-2 bg-danger bg-opacity-10 rounded-circle">
                <XCircle size={20} className="text-danger" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.tuChoi}</h2>
          </div>
        </div>
      </div>

      {/* 4. Tổng giá trị */}
      <div className="col-12 col-md-3">
        <div className="card shadow-sm border-0 border-start border-4 border-primary h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Tổng giá trị</h6>
              <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
                <DollarSign size={20} className="text-primary" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold text-primary">
              {formatCompactMoney(stats.tongTien)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}