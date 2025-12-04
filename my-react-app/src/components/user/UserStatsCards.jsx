import { useState, useEffect } from "react";
import { Users, UserCheck, Shield, User } from "lucide-react";
import { getAllUsers } from "../../services/userService";

export default function UserStatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admin: 0,
    others: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi API lấy danh sách (Lấy số lượng lớn để đếm, ví dụ 1000)
        // Nếu database lớn hơn 1000, bạn nên nhờ Backend viết API stats riêng.
        const res = await getAllUsers(0, 1000); 
        
        const users = res.data; // Danh sách user
        const total = res.totalElements; // Tổng số bản ghi trong DB

        // 1. Đếm user đang hoạt động
        const activeCount = users.filter(u => u.trangThai === 'HOAT_DONG').length;

        // 2. Đếm Admin (Kiểm tra mã vai trò là ADMIN)
        const adminCount = users.filter(u => u.maVaiTro?.maVaiTro === 'ADMIN').length;

        // 3. User thường (Tổng - Admin)
        const otherCount = total - adminCount;

        setStats({
          total: total,
          active: activeCount,
          admin: adminCount,
          others: otherCount
        });

      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="row g-4 mb-4">
      {/* Card 1: Tổng người dùng */}
      <div className="col-12 col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Tổng người dùng</h6>
              <div className="p-2 bg-primary bg-opacity-10 rounded">
                <Users size={20} className="text-primary" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.total}</h2>
          </div>
        </div>
      </div>

      {/* Card 2: Đang hoạt động */}
      <div className="col-12 col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Đang hoạt động</h6>
              <div className="p-2 bg-success bg-opacity-10 rounded">
                <UserCheck size={20} className="text-success" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.active}</h2>
            <small className="text-muted" style={{fontSize: '0.8rem'}}>
                /{stats.total} tài khoản
            </small>
          </div>
        </div>
      </div>

      {/* Card 3: Admin */}
      <div className="col-12 col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Quản trị viên</h6>
              <div className="p-2 bg-danger bg-opacity-10 rounded">
                <Shield size={20} className="text-danger" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.admin}</h2>
          </div>
        </div>
      </div>

      {/* Card 4: Người dùng thường */}
      <div className="col-12 col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-muted mb-0 fw-semibold">Người dùng khác</h6>
              <div className="p-2 bg-info bg-opacity-10 rounded">
                <User size={20} className="text-info" />
              </div>
            </div>
            <h2 className="mb-0 fw-bold">{stats.others}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}