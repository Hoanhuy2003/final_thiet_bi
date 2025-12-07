// src/components/Header.jsx
import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 👇 Import thêm getUserRole để check quyền
import { logout, getToken, getUserRole } from "../services/authService";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Header({ onToggleSidebar, isSidebarOpen, isUserLayout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Gọi API lấy thông tin (Đường dẫn này chuẩn theo backend bạn cung cấp)
        const res = await axiosInstance.get("/api/nguoi_dung/myInfo", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        // Backend trả về: res.data.result
        setUser(res.data.result || {}); 
      } catch (err) {
        console.error("Không lấy được thông tin người dùng:", err);
      }
    };
    fetchUser();
  }, []);

  const handleProfileClick = () => {
    const role = getUserRole();
    
    // 👇 LOGIC ĐIỀU HƯỚNG MỚI (Khớp với App.jsx vừa sửa)
    if (['GIANGVIEN'].includes(role)) {
       // Giảng viên đi đường Portal
       navigate("/portal/profile");
    } else {
       // Admin/Nhân viên đi đường gốc (đã bỏ /admin)
       navigate("/profile");
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    // navigate("/login"); // Hàm logout đã tự chuyển hướng
  };

  return (
    <header className={`navbar navbar-expand navbar-light border-bottom shadow-sm sticky-top ${isUserLayout ? 'bg-white' : 'bg-white'}`}>
      <div className="container-fluid px-4">
        
        {/* Nút Toggle Sidebar (Ẩn nếu là layout User để giao diện thoáng hơn) */}
        {!isUserLayout && (
          <button
            className="btn btn-link text-dark me-3"
            onClick={onToggleSidebar}
          >
            <i className={`bi ${isSidebarOpen ? "bi-list" : "bi-list"} fs-3`}></i>
          </button>
        )}

        {/* Logo cho User Layout (Hiện khi không có nút toggle) */}
        {isUserLayout && (
           <a className="navbar-brand d-flex align-items-center fw-bold text-primary" href="/portal/dashboard">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: 32, height: 32}}>EQ</div>
              EquipMS Portal
           </a>
        )}

        <ul className="navbar-nav ms-auto align-items-center gap-3">
          {/* Notification */}
          <li className="nav-item dropdown">
            <a className="nav-link position-relative text-secondary" href="#" data-bs-toggle="dropdown">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: "0.6rem" }}>
                3
              </span>
            </a>
            {/* Dropdown notification demo */}
             <ul className="dropdown-menu dropdown-menu-end mt-2 shadow-sm border-0">
                <li><span className="dropdown-item-text small text-muted">Không có thông báo mới</span></li>
             </ul>
          </li>

          <div className="vr h-50 mx-2 text-secondary opacity-25"></div>

          {/* User Info */}
          <li className="nav-item dropdown">
            <a className="nav-link d-flex align-items-center gap-2 text-decoration-none cursor-pointer" href="#" data-bs-toggle="dropdown">
              <div className="text-end d-none d-md-block" style={{lineHeight: '1.2'}}>
                <div className="fw-bold text-dark small">
                    {/* 👇 Sửa user.hoTen thành user.tenND cho khớp Backend */}
                    {user.tenND || user.hoTen || "Người dùng"}
                </div>
                <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    {user.vaiTro?.tenVaiTro || "Thành viên"}
                    {user.donVi && ` - ${user.donVi.tenDonVi}`}
                </div>
              </div>
              
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center border border-primary border-opacity-25" style={{ width: 40, height: 40 }}>
                <User size={20} />
              </div>
            </a>

            <ul className="dropdown-menu dropdown-menu-end mt-2 shadow border-0 rounded-3 p-2">
              <li>
                {/* Mobile view info */}
                <div className="d-md-none px-3 py-2 border-bottom mb-2">
                   <div className="fw-bold">{user.tenND}</div>
                   <div className="small text-muted">{user.vaiTro?.tenVaiTro}</div>
                </div>
              </li>
              <li>
                <button className="dropdown-item rounded-2 py-2" onClick={handleProfileClick}>
                  <User className="me-2 text-secondary" size={16} /> Thông tin cá nhân
                </button>
              </li>
              <li><hr className="dropdown-divider my-2" /></li>
              <li>
                <button className="dropdown-item rounded-2 py-2 text-danger fw-medium" onClick={handleLogoutClick}>
                  <LogOut className="me-2" size={16} /> Đăng xuất
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
}