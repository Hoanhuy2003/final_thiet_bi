import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, 
  FileText, 
  List, 
  PlusCircle, 
  CheckCircle2, 
  XCircle,
  Trash2,
  AlertTriangle
} from 'lucide-react'; 
import userService from '../../services/userService';
import { equipmentService } from '../../services/equipmentService';

const UnitManagerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    broken: 0,
    pendingProposals: 0 
  });
  const [unitName, setUnitName] = useState("Đơn vị");
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
        try {
            const userInfo = await userService.getMyInfo();
            setManagerName(userInfo.hoTen || "Trưởng Khoa");
            
            const unit = userInfo.donVi || userInfo.don_vi || {};
            const myUnitName = unit.tenDonVi || unit.ten_don_vi || "Không xác định";
            setUnitName(myUnitName);

            // Lấy toàn bộ thiết bị (size lớn để lấy hết)
            const resEq = await equipmentService.getAll({ size: 3000 });
            const allEquipment = resEq.result?.content || resEq.result || resEq.data || resEq || [];

            console.log("📦 Tổng thiết bị từ API:", allEquipment.length);

            // Lọc thiết bị thuộc đơn vị (dùng tên đơn vị vì response chỉ có tên)
            const unitEquipment = allEquipment.filter(item => 
              (item.donVi || "").trim().toLowerCase() === myUnitName.trim().toLowerCase()
            );

            console.log(`🏢 Thiết bị thuộc "${myUnitName}": ${unitEquipment.length}`);

            // Tính toán thống kê
            const total = unitEquipment.length;

            const active = unitEquipment.filter(item => 
              item.tinhTrang === "Đang sử dụng" || item.tinhTrang === "Sẵn sàng"
            ).length;

            const broken = unitEquipment.filter(item => 
              ["Hỏng hóc", "Bảo trì", "Chờ thanh lý"].includes(item.tinhTrang)
            ).length;

            setStats({
                total,
                active,
                broken,
                pendingProposals: 0 // Có thể thêm API riêng nếu cần
            });

        } catch(e) {
            console.error("Lỗi tải dữ liệu dashboard:", e);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
            <h6 className="text-muted text-uppercase fw-bold mb-1">Tổng quan quản lý</h6>
            <h2 className="fw-bold text-primary mb-0">{unitName}</h2>
        </div>
        <div className="text-end">
             <span className="text-muted">Người quản lý:</span> <strong>{managerName}</strong>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{borderLeft: "5px solid #0d6efd"}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-2">Tổng Tài Sản Khoa</h6>
                        <h2 className="fw-bold mb-0">{stats.total}</h2>
                        <small className="text-muted">Tất cả thiết bị đang quản lý</small>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                        <PieChart size={32}/>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{borderLeft: "5px solid #198754"}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-2">Đang sử dụng tốt</h6>
                        <h2 className="fw-bold text-success mb-0">{stats.active}</h2>
                        <small className="text-muted">Sẵn sàng phục vụ giảng dạy</small>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                        <CheckCircle2 size={32}/>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{borderLeft: "5px solid #dc3545"}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-muted mb-2">Cần xử lý (Hỏng/Bảo trì)</h6>
                        <h2 className="fw-bold text-danger mb-0">{stats.broken}</h2>
                        <small className="text-muted">Cần đề xuất sửa chữa hoặc thanh lý</small>
                    </div>
                    <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                        <AlertTriangle size={32}/>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION MENU: Các việc Sếp cần làm */}
      <h5 className="fw-bold text-dark mb-3">Tác Vụ Quản Lý</h5>
      <div className="row g-3">
        
        {/* 1. Xem danh sách */}
        <div className="col-md-6 col-lg-3">
            <Link to="/portal/my-equipment" className="card text-decoration-none border-0 shadow-sm hover-up h-100">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-light p-3 rounded-circle me-3">
                        <List size={28} className="text-primary"/>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-1">Tra Cứu Tài Sản</h6>
                        <small className="text-muted d-block">Xem danh sách thiết bị</small>
                    </div>
                </div>
            </Link>
        </div>

        {/* 2. Tạo đề xuất Mua Sắm */}
        <div className="col-md-6 col-lg-3">
            <Link to="/portal/create-proposal" className="card text-decoration-none border-0 shadow-sm hover-up h-100">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-light p-3 rounded-circle me-3">
                        <PlusCircle size={28} className="text-success"/>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-1">Đề Xuất Mua Sắm</h6>
                        <small className="text-muted d-block">Xin cấp mới thiết bị</small>
                    </div>
                </div>
            </Link>
        </div>

        {/* 3. Tạo Yêu Cầu Thanh Lý */}
        <div className="col-md-6 col-lg-3">
            <Link to="/portal/disposal-request" className="card text-decoration-none border-0 shadow-sm hover-up h-100">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-light p-3 rounded-circle me-3">
                        <Trash2 size={28} className="text-danger"/>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-1">Yêu Cầu Thanh Lý</h6>
                        <small className="text-muted d-block">Tờ trình thanh lý thiết bị</small>
                    </div>
                </div>
            </Link>
        </div>

        {/* 4. Theo dõi đề xuất */}
        <div className="col-md-6 col-lg-3">
            <Link to="/portal/my-proposals" className="card text-decoration-none border-0 shadow-sm hover-up h-100">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-light p-3 rounded-circle me-3">
                        <FileText size={28} className="text-info"/>
                    </div>
                    <div>
                        <h6 className="fw-bold text-dark mb-1">Lịch Sử Đề Xuất</h6>
                        <small className="text-muted d-block">Trạng thái yêu cầu đã gửi</small>
                    </div>
                </div>
            </Link>
        </div>

      </div>

      <style>{`
        .hover-up { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-up:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
      `}</style>
    </div>
  );
};

export default UnitManagerDashboard;