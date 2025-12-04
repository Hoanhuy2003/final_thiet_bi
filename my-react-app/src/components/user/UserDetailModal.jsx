import { useState, useEffect } from "react";

export default function UserDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedUser");
      if (data) {
        setUser(JSON.parse(data));
        setIsOpen(true);
      }
    };
    window.addEventListener("openDetailUserModal", handler);
    return () => window.removeEventListener("openDetailUserModal", handler);
  }, []);

  if (!isOpen || !user) return null;

  // Helper: Hiển thị trạng thái tiếng Việt
  const getStatusLabel = (status) => {
    if (status === 'HOAT_DONG') return 'Hoạt động';
    if (status === 'KHOA') return 'Đã khóa';
    if (status === 'CHO_DUYET') return 'Chờ duyệt';
    return status;
  };

  // Helper: Format ngày (nếu có trường ngayTao)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
        return dateString;
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết người dùng</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3">
             
              {/* Họ tên */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Họ tên</label>
                <input 
                    type="text" 
                    className="form-control bg-light" 
                    value={user.hoTen || ""} 
                    readOnly 
                />
              </div>

              {/* Email */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Email</label>
                <input 
                    type="email" 
                    className="form-control bg-light" 
                    value={user.email || ""} 
                    readOnly 
                />
              </div>

              {/* Số điện thoại */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Số điện thoại</label>
                <input 
                    type="text" 
                    className="form-control bg-light" 
                    value={user.soDienThoai || user.sdt || "-"} 
                    readOnly 
                />
              </div>

              {/* Vai trò - Lấy từ object con */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Vai trò</label>
                <input 
                    type="text" 
                    className="form-control bg-light" 
                    value={user.maVaiTro?.tenVaiTro || "Chưa phân quyền"} 
                    readOnly 
                />
              </div>

              {/* Đơn vị - Lấy từ object con */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Đơn vị</label>
                <input 
                    type="text" 
                    className="form-control bg-light" 
                    value={user.donVi?.tenDonVi || "Chưa cập nhật"} 
                    readOnly 
                />
              </div>

              {/* Trạng thái */}
              <div className="col-6">
                <label className="form-label fw-bold text-muted small">Trạng thái</label>
                <input 
                    type="text" 
                    className="form-control bg-light" 
                    value={getStatusLabel(user.trangThai)} 
                    readOnly 
                />
              </div>

             
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}