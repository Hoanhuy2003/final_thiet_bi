// src/components/inventory/InventorySessionsTable.jsx
import React, { useState, useEffect } from "react";
import { ClipboardCheck, Eye } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";
import toast from "react-hot-toast";

// --- 1. ĐỊNH NGHĨA MÀU SẮC TRẠNG THÁI (Đã thêm "Mới tạo") ---
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-success text-white"; // Xanh lá
    case "Đang kiểm kê":
      return "bg-primary text-white"; // Xanh dương
    case "Mới tạo":
      return "bg-warning text-dark";  // Vàng (Cho nổi bật cái mới)
    default:
      return "bg-secondary text-white"; // Xám (Mặc định)
  }
};

export default function InventorySessionsTable() {
  const [sessionsList, setSessionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logic tải dữ liệu từ API
  const loadSessions = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const response = await inventoryService.getAllSessions(page, size);
      
      let dataArray = [];
      // Trích xuất dữ liệu an toàn từ Page hoặc List
      if (Array.isArray(response)) {
          dataArray = response; 
      } else if (response && Array.isArray(response.content)) {
          dataArray = response.content; 
      }
      
      setSessionsList(dataArray);
      
    } catch (error) {
      console.error("Lỗi tải danh sách kiểm kê:", error);
      toast.error("Không tải được danh sách phiên kiểm kê.");
      setSessionsList([]); 
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu khi component mount & lắng nghe sự kiện reload
  useEffect(() => {
    loadSessions();
      
    const handleReload = () => loadSessions();
    window.addEventListener("reloadInventoryTable", handleReload);
    return () => window.removeEventListener("reloadInventoryTable", handleReload);
  }, []);


  const openChecklist = (session) => {
    // Lưu session vào storage để Modal đọc được
    localStorage.setItem("selectedInventorySession", JSON.stringify(session));
    // Phát sự kiện mở modal
    window.dispatchEvent(new Event("openChecklistModal"));
  };

  const openDetail = (session) => {
    localStorage.setItem("selectedInventorySession", JSON.stringify(session));
    window.dispatchEvent(new Event("openDetailInventoryModal"));
  };
  
  if (loading) {
    return (
        <div className="card shadow-sm p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Đang tải danh sách kiểm kê...</p>
        </div>
    );
  }
  
  if (sessionsList.length === 0) {
    return (
        <div className="card shadow-sm p-5 text-center">
            <p className="text-muted">Chưa có phiên kiểm kê nào được tạo.</p>
        </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="mb-0">Danh sách phiên kiểm kê</h5>
        <small className="text-muted">Hiển thị {sessionsList.length} kết quả gần nhất</small>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã phiếu</th>
                <th>Phòng</th>
                <th>Người kiểm kê</th>
                <th className="text-center">Tiến độ</th>
                <th className="text-center">Tồn tại</th>
                <th className="text-center">Mất</th>
                <th className="text-center">Hỏng</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sessionsList.map((session) => {
                // Tính toán hiển thị tiến độ
                const tongThietBi = session.tongSoLuong > 0 ? session.tongSoLuong : 1; 
                // Nếu chưa kiểm cái nào (mới tạo) thì daKiem = 0
                const daKiem = session.tonTai + session.hong + session.mat; 
                const progressPercent = Math.round((daKiem / tongThietBi) * 100);
                
                return (
                  <tr key={session.maKiemKe}>
                    <td className="fw-bold text-primary">{session.maKiemKe}</td>
                    <td>
                        <div className="fw-medium">{session.tenPhong}</div>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>{session.tenDonVi}</small>
                    </td> 
                    <td>{session.tenNguoiKiemKe}</td>
                    
                    {/* Cột Tiến độ */}
                    <td style={{minWidth: '120px'}}>
                      <div className="d-flex flex-column align-items-center">
                        <div className="progress w-100" style={{ height: "6px" }}>
                          <div 
                            className={`progress-bar ${progressPercent === 100 ? 'bg-success' : 'bg-primary'}`} 
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-muted" style={{fontSize: '0.75rem'}}>
                            {daKiem}/{session.tongSoLuong} ({progressPercent}%)
                        </span>
                      </div>
                    </td>

                    <td className="text-center text-success fw-bold">{session.tonTai}</td>
                    <td className="text-center text-danger fw-bold">{session.mat}</td>
                    <td className="text-center text-warning fw-bold">{session.hong}</td>
                    
                    {/* Cột Trạng thái (Đã có màu cho Mới tạo) */}
                    <td>
                      <span className={`badge ${getStatusBadgeClass(session.trangThai)}`}>
                        {session.trangThai}
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                            {/* Nút Kiểm kê: Hiện cho "Mới tạo" và "Đang kiểm kê" */}
                            {session.trangThai !== 'Hoàn thành' && (
                                <button 
                                    className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // <-- QUAN TRỌNG: Ngăn chặn click lan truyền
                                        openChecklist(session);
                                    }} 
                                    title="Tiếp tục kiểm kê"
                                >
                                    <ClipboardCheck size={16} /> <span className="d-none d-md-inline">Kiểm kê</span>
                                </button>
                            )}
                            
                            {/* Nút Xem chi tiết */}
                            <button 
                                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDetail(session);
                                }} 
                                title="Xem chi tiết"
                            >
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