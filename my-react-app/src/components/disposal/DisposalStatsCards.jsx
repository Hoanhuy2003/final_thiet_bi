import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Trash2, RefreshCw } from "lucide-react";
import thanhLyService from "../../services/disposalService";
import toast from "react-hot-toast";

export default function DisposalStatsCards() {
  const [stats, setStats] = useState({
    choDuyet: 0,
    hoanTat: 0,
    tuChoi: 0,
    tongThuVe: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await thanhLyService.getAll();

      const choDuyet = data.filter(p => p.trangThai === "Chờ duyệt").length;
      const hoanTat = data.filter(p => p.trangThai === "Hoàn tất").length;
      const tuChoi = data.filter(p => p.trangThai === "Từ chối").length;

      const tongThuVe = data
        .filter(p => p.trangThai === "Hoàn tất")
        .reduce((sum, p) => sum + (p.tongGiaTriThuVe || 0), 0);

      setStats({
        choDuyet,
        hoanTat,
        tuChoi,
        tongThuVe,
      });
    } catch (err) {
      console.error("Lỗi tải thống kê thanh lý:", err);
      toast.error("Không tải được thống kê");
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu
  useEffect(() => {
    loadStats();
  }, []);

  // Tự động cập nhật khi có duyệt/từ chối phiếu (giống bảng)
  useEffect(() => {
    const handleReload = () => {
      console.log("Cập nhật thống kê thanh lý...");
      loadStats();
    };
    window.addEventListener("reloadThanhLyTable", handleReload);
    return () => window.removeEventListener("reloadThanhLyTable", handleReload);
  }, []);

  const formatCurrency = (value) => {
    if (value === 0) return "0 đ";
    if (!value) return "0 đ";
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
  };

  const formatBigNumber = (value) => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + " Tỷ";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + " Tr";
    if (value >= 1_000) return (value / 1_000).toFixed(0) + " N";
    return value.toString();
  };

  return (
    <div className="row g-4 mb-4">
      {/* Chờ duyệt */}
      <div className="col-12 col-md-3">
        <div className="card border-warning shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Chờ duyệt</h6>
              {loading ? (
                <RefreshCw size={20} className="text-warning animate-spin" />
              ) : (
                <Clock size={20} className="text-warning" />
              )}
            </div>
            <h2 className="mb-0 text-warning fw-bold">
              {loading ? "..." : stats.choDuyet}
            </h2>
            <small className="text-muted">phiếu đang chờ xử lý</small>
          </div>
        </div>
      </div>

      {/* Đã duyệt (Hoàn tất) */}
      <div className="col-12 col-md-3">
        <div className="card border-success shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Hoàn tất</h6>
              <CheckCircle size={20} className="text-success" />
            </div>
            <h2 className="mb-0 text-success fw-bold">
              {loading ? "..." : stats.hoanTat}
            </h2>
            <small className="text-muted">phiếu đã phê duyệt</small>
          </div>
        </div>
      </div>

      {/* Từ chối */}
      <div className="col-12 col-md-3">
        <div className="card border-danger shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Từ chối</h6>
              <XCircle size={20} className="text-danger" />
            </div>
            <h2 className="mb-0 text-danger fw-bold">
              {loading ? "..." : stats.tuChoi}
            </h2>
            <small className="text-muted">phiếu bị từ chối</small>
          </div>
        </div>
      </div>

      {/* Tổng thu hồi */}
      <div className="col-12 col-md-3">
        <div className="card border-primary shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Giá trị thu hồi</h6>
              <Trash2 size={20} className="text-primary" />
            </div>
            <h2 className="mb-0 text-primary fw-bold">
              {loading ? "..." : formatBigNumber(stats.tongThuVe)}
            </h2>
            <small className="text-muted d-block">
              {loading ? "..." : formatCurrency(stats.tongThuVe)}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}