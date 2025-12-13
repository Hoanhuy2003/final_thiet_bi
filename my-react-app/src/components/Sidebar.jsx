// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { getUserRole } from "../services/authService"; 

export default function Sidebar({ isOpen = true, onToggle }) {
  const role = getUserRole(); // Lấy role hiện tại

  // ==================== 1. MENU QUẢN TRỊ (ADMIN + TẤT CẢ NHÂN VIÊN) ====================
  const adminMenu = [
    { to: "/dashboard", icon: "bi-speedometer2", label: "Tổng quan", exact: true },
    { to: "/equipment", icon: "bi-cpu", label: "Quản lý thiết bị" },
    { to: "/batch", icon: "bi-box-seam", label: "Quản lý lô" },
    { to: "/inventory", icon: "bi-clipboard-check", label: "Kiểm kê" },
    { to: "/disposal", icon: "bi-recycle", label: "Thanh lý" },
    { to: "/procurement", icon: "bi-cart3", label: "Mua sắm" },
    { to: "/users", icon: "bi-people", label: "Người dùng" },
    { to: "/profile", icon: "bi-person-circle", label: "Hồ sơ cá nhân" },
  ];

  // ==================== 2. MENU CHO GIẢNG VIÊN (USER) ====================
  const userMenu = [
    { to: "/portal/dashboard", icon: "bi-speedometer2", label: "Dashboard", exact: true },
    { to: "/portal/my-equipment", icon: "bi-laptop", label: "Thiết bị của tôi" },
    { to: "/portal/create-proposal", icon: "bi-cart-plus", label: "Đề xuất mua" },
    { to: "/portal/disposal-request", icon: "bi-trash", label: "Yêu cầu thanh lý" },
    { to: "/portal/profile", icon: "bi-person-circle", label: "Hồ sơ cá nhân" },
  ];

  // ==================== 3. XÁC ĐỊNH MENU HIỂN THỊ ====================
  // Tất cả nhân viên (bao gồm cả NHANVIENTHIETBI, NHANVIENKIEMKE, NHANVIENMUASAM) đều dùng menu admin
  const adminAndStaffRoles = [
    'ADMIN', 'THUKHO', 'HIEUTRUONG', 'HCQT', 'VT001',
    'NHANVIENTHIETBI', 'NHANVIENKIEMKE', 'NHANVIENMUASAM'
  ];

  const isAdminOrStaff = adminAndStaffRoles.includes(role);
  const isGiangVien = ['GIANGVIEN', 'VT007'].includes(role);

  // Nếu là giảng viên → menu portal
  // Nếu là nhân viên/admin → menu admin
  // Nếu không xác định → mặc định menu admin (tránh lỗi)
  const menuItems = isGiangVien ? userMenu : adminMenu;

  const pageTitle = isGiangVien ? "Cổng thông tin" : "Quản trị hệ thống";

  return (
    <aside
      className={`bg-dark text-white d-flex flex-column ${
        isOpen ? "w-sidebar-open" : "w-sidebar-closed"
      } flex-shrink-0 h-100`}
      style={{
        width: isOpen ? "280px" : "70px",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo Area */}
      <div className="p-4 border-bottom border-secondary d-flex align-items-center gap-3">
        {isOpen ? (
          <>
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow" style={{ width: 50, height: 50, fontSize: "1.5rem" }}>
              EQ
            </div>
            <div>
              <h1 className="h5 fw-bold text-white mb-0">EquipMS</h1>
              <small className="text-light opacity-75">
                {pageTitle}
              </small>
            </div>
          </>
        ) : (
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto shadow" style={{ width: 50, height: 50, fontSize: "1.5rem" }}>
            EQ
          </div>
        )}
      </div>

      {/* Menu Area */}
      <nav className="flex-grow-1 px-3 py-3 overflow-auto sidebar-nav">
        <ul className="nav flex-column gap-2">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none ${
                    isActive
                      ? "bg-primary text-white shadow-sm fw-semibold"
                      : "text-light hover-bg-primary-light"
                  }`
                }
                title={!isOpen ? item.label : undefined}
              >
                <i className={`bi ${item.icon} fs-4`} style={{ minWidth: "28px" }}></i>
                {isOpen && <span className="fw-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer nhỏ */}
      {isOpen && (
        <div className="p-3 text-center text-white-50 border-top border-secondary small">
          Version 1.0
        </div>
      )}
    </aside>
  );
}