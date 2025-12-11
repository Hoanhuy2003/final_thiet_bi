import React, { useState, useEffect } from "react";
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";

export default function InventoryStatsCards() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalChecked: 0,
    totalIssues: 0,
    accuracy: 100,
  });

  // Hàm tải và tính toán thống kê
  const loadStats = async () => {
    try {
      // Lấy danh sách phiếu (Lấy 1000 phiếu gần nhất để tính toán sơ bộ)
      // Trong thực tế nếu dữ liệu lớn, nên có API riêng /api/kiem-ke/stats
      const response = await inventoryService.getAllSessions(0, 1000);
      
      const data = Array.isArray(response) ? response : (response.content || []);

      let totalCheckedCount = 0;
      let totalIssuesCount = 0;

      data.forEach(session => {
        // Số lượng đã kiểm trong phiên này
        const checkedInSession = (session.tonTai || 0) + (session.hong || 0) + (session.mat || 0);
        // Số lượng lỗi (Hỏng + Mất)
        const issuesInSession = (session.hong || 0) + (session.mat || 0);

        totalCheckedCount += checkedInSession;
        totalIssuesCount += issuesInSession;
      });

      // Tính tỷ lệ chính xác
      const accuracyRate = totalCheckedCount === 0 
        ? 100 
        : ((totalCheckedCount - totalIssuesCount) / totalCheckedCount) * 100;

      setStats({
        totalSessions: data.length,
        totalChecked: totalCheckedCount,
        totalIssues: totalIssuesCount,
        accuracy: parseFloat(accuracyRate.toFixed(1)), // Làm tròn 1 chữ số thập phân
      });

    } catch (error) {
      console.error("Lỗi tính toán thống kê:", error);
    }
  };

  useEffect(() => {
    loadStats();

    // Lắng nghe sự kiện reload để cập nhật số liệu ngay khi có thay đổi
    const handleReload = () => loadStats();
    window.addEventListener("reloadInventoryTable", handleReload);
    return () => window.removeEventListener("reloadInventoryTable", handleReload);
  }, []);

  return (
    <div className="row g-4 mb-4">
      {/* Card 1: Tổng phiên */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tổng phiên kiểm kê</h6>
              <div className="p-2 bg-primary bg-opacity-10 rounded">
                <ClipboardCheck size={20} className="text-primary" />
              </div>
            </div>
            <h2 className="mb-2">{stats.totalSessions}</h2>
            <p className="text-xs text-muted mb-0">Phiếu đã tạo</p>
          </div>
        </div>
      </div>

      {/* Card 2: Đã kiểm tra */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Đã kiểm tra</h6>
              <div className="p-2 bg-success bg-opacity-10 rounded">
                <CheckCircle size={20} className="text-success" />
              </div>
            </div>
            <h2 className="mb-2">{stats.totalChecked}</h2>
            <p className="text-xs text-muted mb-0">Thiết bị đã rà soát</p>
          </div>
        </div>
      </div>

      {/* Card 3: Mất/Hỏng */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Mất / Hỏng</h6>
              <div className="p-2 bg-danger bg-opacity-10 rounded">
                <XCircle size={20} className="text-danger" />
              </div>
            </div>
            <h2 className="mb-2">{stats.totalIssues}</h2>
            <p className="text-xs text-muted mb-0">Phát hiện sự cố</p>
          </div>
        </div>
      </div>

      {/* Card 4: Tỷ lệ chính xác */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0">Tỷ lệ an toàn</h6>
              <div className="p-2 bg-warning bg-opacity-10 rounded">
                <AlertTriangle size={20} className="text-warning" />
              </div>
            </div>
            <h2 className="mb-2">{stats.accuracy}%</h2>
            <p className="text-xs text-muted mb-0">So với sổ sách</p>
          </div>
        </div>
      </div>
    </div>
  );
}