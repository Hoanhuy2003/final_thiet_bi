// src/components/dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen = true, onToggle }) {
  const menuItems = [
    { to: "/", icon: "bi-speedometer2", label: "Tổng quan", exact: true },
    { to: "/equipment", icon: "bi-cpu", label: "Quản lý thiết bị" },
    { to: "/batch", icon: "bi-box-seam", label: "Quản lý lô thiết bị" },
    { to: "/inventory", icon: "bi-clipboard-check", label: "Kiểm kê" },
    { to: "/disposal", icon: "bi-recycle", label: "Thanh lý" },
    { to: "/procurement", icon: "bi-cart3", label: "Mua sắm" },
    { to: "/users", icon: "bi-people", label: "Người dùng" },
    { to: "/reports", icon: "bi-file-earmark-bar-graph", label: "Báo cáo" },
  ];

  return (
    <aside
      className={`bg-dark text-white d-flex flex-column ${
        isOpen ? "w-sidebar-open" : "w-sidebar-closed"
      } flex-shrink-0 h-100`}  // Thêm h-100 ở đây, bỏ inline style minHeight
      style={{
        width: isOpen ? "280px" : "70px",
        transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <div className="p-4 border-bottom border-secondary d-flex align-items-center gap-3">
        {isOpen ? (
          <>
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow" style={{ width: 50, height: 50, fontSize: "1.5rem" }}>
              EQ
            </div>
            <div>
              <h1 className="h5 fw-bold text-white mb-0">EquipMS</h1>
              <small className="text-light opacity-75">Quản lý thiết bị</small>
            </div>
          </>
        ) : (
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto shadow" style={{ width: 50, height: 50, fontSize: "1.5rem" }}>
            EQ
          </div>
        )}
      </div>

      {/* Menu - chiếm hết chiều cao còn lại */}
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
    </aside>
  );
}