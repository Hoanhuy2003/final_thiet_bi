// src/components/dashboard/Header.jsx
import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/authService";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  // Khởi tạo state rỗng để tránh lỗi undefined khi chưa có dữ liệu
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/nguoi_dung/myInfo", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        // Dữ liệu nằm trong res.data.result
        setUser(res.data.result); 
      } catch (err) {
        console.error("Không lấy được thông tin người dùng:", err);
      }
    };
    fetchUser();
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate("/login"); // Thêm dòng này để chuyển hướng sau khi logout
  };

  return (
    <header className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <button
          className="btn btn-link text-dark me-3"
          onClick={onToggleSidebar}
        >
          <i className={`bi ${isSidebarOpen ? "bi-list" : "bi-list"} fs-3`}></i>
        </button>

        <ul className="navbar-nav align-items-center gap-3">
          {/* ... Phần Notification giữ nguyên ... */}
          <li className="nav-item dropdown">
            <a className="nav-link position-relative" href="#" data-bs-toggle="dropdown">
              <Bell size={22} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.65rem" }}>
                3
              </span>
            </a>
            {/* ... Dropdown notification ... */}
          </li>

          {/* User Info */}
          <li className="nav-item dropdown">
            <a className="nav-link d-flex align-items-center gap-2 text-decoration-none" href="#" data-bs-toggle="dropdown">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                <User size={20} />
              </div>
              <div className="d-none d-md-block text-start">
                
                {/* 1. Hiển thị Họ Tên */}
                <div className="fw-semibold small">
                    {user.hoTen || "Admin"}
                </div>
                
                {/* 2. Hiển thị Vai Trò (Lấy từ object con) */}
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {user.maVaiTro?.tenVaiTro || "Chức vụ"}
                </div>
                
                 {/* 3. Hiển thị Đơn vị (Check null vì json trả về null) */}
                 {user.donVi && (
                    <div className="text-muted fst-italic" style={{ fontSize: "0.65rem" }}>
                        {user.donVi.tenDonVi || user.donVi}
                    </div>
                 )}

              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end mt-2 shadow">
              <li>
                <button className="dropdown-item" onClick={handleProfileClick}>
                  <User className="me-2" size={16} /> Trang cá nhân
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogoutClick}>
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