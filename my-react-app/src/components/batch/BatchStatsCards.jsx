import { useEffect, useState } from "react";
import { Package, CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import { loThietBiService } from "../../services/batchService"; // Kiểm tra kỹ tên file service của bạn

export default function BatchStatsCards() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalDevices: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await loThietBiService.getStats();
        // Xử lý linh hoạt mọi cấu trúc response
        const data = res.result || res.data || res; 
        
        if (data) {
             setStats({
                totalBatches: Number(data.tongLo) || 0,
                totalDevices: Number(data.tongTB) || 0,
                totalValue: Number(data.tongTien) || 0
            });
        }
      } catch (error) {
        console.error("Lỗi lấy thống kê lô:", error);
      }
    };
    
    fetchStats();

    window.addEventListener("reloadBatchTable", fetchStats);
    return () => window.removeEventListener("reloadBatchTable", fetchStats);
  }, []);

  const formatBigMoney = (amount) => {
    // Ép kiểu sang Number để tránh lỗi .toFixed nếu amount là string
    const num = Number(amount);
    
    if (!num) return "0đ";
    
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + " tỷ";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + " tr";
    }
    return num.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="row g-4 mb-4">
      {/* CARD 1: TỔNG SỐ LÔ */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-bold">Tổng lô nhập</h6>
              <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
                 <Package size={20} className="text-primary" />
              </div>
            </div>
            <h2 className="mb-2 fw-bold">{stats.totalBatches}</h2>
            <p className="text-xs text-muted mb-0">
               <span className="text-success fw-bold"><TrendingUp size={14} className="me-1"/></span>
               Lô hàng đã nhập kho
            </p>
          </div>
        </div>
      </div>

      {/* CARD 2: TỔNG SỐ THIẾT BỊ (QUY MÔ) */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-bold">Tổng thiết bị</h6>
              <div className="p-2 bg-success bg-opacity-10 rounded-circle">
                 <CheckCircle size={20} className="text-success" />
              </div>
            </div>
            
            {/* Đã sửa lỗi crash tại đây */}
            <h2 className="mb-2 fw-bold">
                {stats.totalDevices.toLocaleString("vi-VN")}
            </h2>
            
            <p className="text-xs text-muted mb-0">Thiết bị từ các lô</p>
          </div>
        </div>
      </div>

      {/* CARD 3: GIÁ TRỊ TỔNG (TIỀN) */}
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-bold">Tổng giá trị</h6>
              <div className="p-2 bg-warning bg-opacity-10 rounded-circle">
                 <DollarSign size={20} className="text-warning" />
              </div>
            </div>
            <h2 className="mb-2 fw-bold text-primary">
                {formatBigMoney(stats.totalValue)}
            </h2>
            <p className="text-xs text-muted mb-0">Tổng nguyên giá nhập kho</p>
          </div>
        </div>
      </div>
    </div>
  );
}