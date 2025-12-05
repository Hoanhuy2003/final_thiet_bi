// src/components/inventory/InventorySessionsTable.jsx
import { ClipboardCheck, Eye } from "lucide-react";

const mockInventorySessions = [
  {
    id: 1,
    ma_kiem_ke: "KK-2024-001",
    phong: "Lab A101",
    don_vi: "Khoa CNTT",
    ngay_kiem_ke: "2024-06-15",
    nguoi_kiem_ke: "Nguyễn Văn A",
    tong_thiet_bi: 45,
    da_kiem: 45,
    ton_tai: 43,
    mat: 1,
    hong: 1,
    trang_thai: "Hoàn thành",
  },
  {
    id: 2,
    ma_kiem_ke: "KK-2024-002",
    phong: "Phòng 203",
    don_vi: "Khoa Cơ khí",
    ngay_kiem_ke: "2024-06-20",
    nguoi_kiem_ke: "Trần Thị B",
    tong_thiet_bi: 32,
    da_kiem: 18,
    ton_tai: 17,
    mat: 0,
    hong: 1,
    trang_thai: "Đang kiểm kê",
  },
  {
    id: 3,
    ma_kiem_ke: "KK-2024-003",
    phong: "Lab B205",
    don_vi: "Khoa Điện tử",
    ngay_kiem_ke: "2024-06-25",
    nguoi_kiem_ke: "Lê Văn C",
    tong_thiet_bi: 28,
    da_kiem: 0,
    ton_tai: 0,
    mat: 0,
    hong: 0,
    trang_thai: "Chưa bắt đầu",
  },
];

const statusColors = {
  "Hoàn thành": "badge-success",
  "Đang kiểm kê": "badge-info",
  "Chưa bắt đầu": "badge-secondary",
};

export default function InventorySessionsTable() {
  const openChecklist = (session) => {
    localStorage.setItem("selectedInventorySession", JSON.stringify(session));
    window.dispatchEvent(new Event("openChecklistModal"));
  };

  const openDetail = (session) => {
    localStorage.setItem("selectedInventorySession", JSON.stringify(session));
    window.dispatchEvent(new Event("openDetailInventoryModal"));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Danh sách phiên kiểm kê</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã kiểm kê</th>
                <th>Phòng</th>
                <th>Đơn vị</th>
                <th>Người kiểm kê</th>
                <th>Tiến độ</th>
                <th>Tồn tại</th>
                <th>Mất</th>
                <th>Hỏng</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockInventorySessions.map((session) => {
                const progressPercent = (session.da_kiem / session.tong_thiet_bi) * 100;
                return (
                  <tr key={session.id}>
                    <td className="font-medium">{session.ma_kiem_ke}</td>
                    <td>{session.phong}</td>
                    <td>{session.don_vi}</td>
                    <td>{session.nguoi_kiem_ke}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress" style={{ width: "80px", height: "8px" }}>
                          <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <span className="text-sm text-muted">{session.da_kiem}/{session.tong_thiet_bi}</span>
                      </div>
                    </td>
                    <td><span style={{ color: "#10b981" }}>{session.ton_tai}</span></td>
                    <td><span style={{ color: "#dc2626" }}>{session.mat}</span></td>
                    <td><span style={{ color: "#f59e0b" }}>{session.hong}</span></td>
                    <td>
                      <span className={`badge ${statusColors[session.trang_thai]}`}>
                        {session.trang_thai}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-link text-dark p-1" onClick={() => openChecklist(session)} title="Kiểm kê">
                          <ClipboardCheck size={16} />
                        </button>
                        <button className="btn btn-sm btn-link text-dark p-1" onClick={() => openDetail(session)} title="Xem chi tiết">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}