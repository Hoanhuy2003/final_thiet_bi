// components/dashboard/StatsCards.jsx
import { Package, CheckCircle, AlertTriangle, TrendingUp, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import dashboardService from "../../services/dashboardService";
import toast from "react-hot-toast";

export function StatsCards() {
  const [stats, setStats] = useState({
    tongThietBi: 0,
    tangTruongThietBi: "0%",
    dangHoatDong: 0,
    tyLeHoatDong: "0%",
    canBaoTri: 0,
    canBaoTriQuaHan: "0",
    giaTriTaiSan: 0,
    ghiChuGiaTri: "Chưa có dữ liệu"
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setStats({
        tongThietBi: data.tongThietBi || 0,
        tangTruongThietBi: data.tangTruongThietBi || "0%",
        dangHoatDong: data.dangHoatDong || 0,
        tyLeHoatDong: data.tyLeHoatDong || "0%",
        canBaoTri: data.canBaoTri || 0,
        canBaoTriQuaHan: data.canBaoTriQuaHan || "0",
        giaTriTaiSan: data.giaTriTaiSan || 0,
        ghiChuGiaTri: data.ghiChuGiaTri || "Sau khấu hao"
      });
    } catch (err) {
      toast.error("Không tải được thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (value) => {
    if (!value) return "0 tỷ";
    return (value / 1_000_000_000).toFixed(1) + " tỷ";
  };

  if (loading) {
    return (
      <div className="row g-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="placeholder-glow">
                  <div className="placeholder col-6 mb-2"></div>
                  <div className="placeholder col-8"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <div className="bg-primary text-white rounded-3 p-3">
                <Laptop  size={28} />
              </div>
            </div>
            <div>
              <h6 className="text-muted mb-1">Tổng thiết bị</h6>
              <h3 className="mb-0">{stats.tongThietBi.toLocaleString()}</h3>
              <small className={stats.tangTruongThietBi.includes("+") ? "text-success" : "text-danger"}>
                {stats.tangTruongThietBi}
              </small>
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
              <h3 className="mb-0">{stats.dangHoatDong.toLocaleString()}</h3>
              <small className="text-muted">{stats.tyLeHoatDong}</small>
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
              <h3 className="mb-0">{stats.canBaoTri}</h3>
              <small className="text-danger">{stats.canBaoTriQuaHan}</small>
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
              <h3 className="mb-0">{formatCurrency(stats.giaTriTaiSan)}</h3>
              <small className="text-muted">{stats.ghiChuGiaTri}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}