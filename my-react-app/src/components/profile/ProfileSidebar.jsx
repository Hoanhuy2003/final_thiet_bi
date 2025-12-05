// src/components/profile/ProfileSidebar.jsx
import { useState, useEffect, useCallback } from "react";
import { User, Edit, Key } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../services/authService";

export default function ProfileSidebar() {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State user
  const [user, setUser] = useState({
    id: "", // Thêm trường id vào khởi tạo
    hoTen: "Đang tải...",
    username: "",
    tenVaiTro: "",
    ngayTao: "", 
  });

  // 1. Tách hàm fetchUser ra để tái sử dụng
  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/nguoi_dung/myInfo", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      
      const data = res.data.result || res.data;
      
      setUser({
        id: data.maNguoiDung, // <--- QUAN TRỌNG: Lưu ID để dùng cho đổi mật khẩu
        hoTen: data.hoTen,
        username: data.tenDangNhap || data.username,
        tenVaiTro: data.maVaiTro?.tenVaiTro || "Người dùng",
        ngayTao: data.ngayTao || "10/11/2025", 
      });
    } catch (err) {
      console.error("Lỗi tải thông tin sidebar:", err);
    }
  }, []);

  // 2. Gọi fetchUser khi component mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 3. LẮNG NGHE SỰ KIỆN "LƯU THÀNH CÔNG" TỪ COMPONENT KIA
  useEffect(() => {
    const handleProfileUpdated = () => {
      setIsEditMode(false); 
      fetchUser();          
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [fetchUser]);

  // Hàm xử lý khi bấm nút "Chỉnh sửa"
  const handleToggleEdit = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    window.dispatchEvent(new Event("toggleEditMode"));
  };

  return (
    <>
      {/* Profile Card */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body text-center p-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
            style={{ width: "100px", height: "100px", backgroundColor: "#0d6efd" }}
          >
            <User size={48} color="white" />
          </div>
          
          <h4 className="mb-1 fw-bold">{user.hoTen}</h4>
          <p className="text-muted mb-3">{user.tenVaiTro}</p>
          
          <span className="badge bg-success bg-opacity-10 text-success mb-4 px-3 py-2 rounded-pill">
            ● Đang hoạt động
          </span>

          <div className="d-grid gap-2">
            <button
              className={`btn ${isEditMode ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleToggleEdit}
            >
              <Edit size={16} className="me-2" />
              {isEditMode ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
            </button>
            
            
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h6 className="mb-0 fw-bold">Thông tin tài khoản</h6>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="text-muted text-sm mb-1 small">Tên đăng nhập</label>
            <p className="mb-0 fw-bold text-dark">{user.username}</p>
          </div>
          <div className="mb-3">
            <label className="text-muted text-sm mb-1 small">Ngày tạo</label>
            <p className="mb-0">{user.ngayTao}</p>
          </div>
          <div>
            <label className="text-muted text-sm mb-1 small">Đăng nhập lần cuối</label>
            <p className="mb-0 text-dark">Vừa xong</p>
          </div>
        </div>
      </div>
    </>
  );
}