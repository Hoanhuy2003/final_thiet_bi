import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// 👇 Import thêm getUserRole
import { isAuthenticated, logout, getUserRole } from './services/authService';

// Layouts
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import UserLayout from './components/UserLayout.jsx'; // Layout cho giảng viên

// Pages - Auth
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Pages - Shared (Dùng chung)
import ProfilePage from "./pages/ProfilePage.jsx"; // Trang hồ sơ

// Pages - Admin / Staff
import DashboardPage from "./pages/DashboardPage.jsx";
import EquipmentPage from "./pages/EquipmentPage.jsx";
import ProcurementPage from "./pages/ProcurementPage.jsx";
import BatchPage from "./pages/BatchPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import DisposalPage from "./pages/DisposalPage.jsx";
import UsersPage from "./pages/UserPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

// Pages - User / Giảng viên
import UserDashboard from "./pages/user/UserDashboard.jsx";
import UserEquipmentList from "./pages/user/UserEquipmentList.jsx";
import UserProcurement from "./pages/user/UserProcurement.jsx";
import UserDisposal from "./pages/user/UserDisposal.jsx";

// ==================== 1. ĐỊNH NGHĨA NHÓM QUYỀN ====================
const ROLES = {
  // Nhóm quản trị: Admin, Thủ kho, Hiệu trưởng, HCQT (VT001...)
  ADMIN_GROUP: ['ADMIN', 'THUKHO', 'HIEUTRUONG', 'HCQT', 'VT001'],
  // Nhóm người dùng: Giảng viên (VT007)
  USER_GROUP: ['GIANGVIEN', 'VT007']
};

// ==================== 2. LAYOUT QUẢN TRỊ (ADMIN) ====================
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="d-flex h-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onLogout={handleLogout}
          isUserLayout={false} // Báo cho Header biết đây là Admin Layout
        />
        <main className="flex-grow-1 overflow-auto bg-light">
          <div className="container-fluid px-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// ==================== 3. XỬ LÝ CHUYỂN HƯỚNG TRANG CHỦ (/) ====================
function HomeRedirect() {
  const role = getUserRole();
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  // Nếu là Admin -> Vào Dashboard quản trị
  if (ROLES.ADMIN_GROUP.includes(role)) return <Navigate to="/dashboard" replace />;
  
  // Nếu là Giảng viên -> Vào Dashboard Portal
  if (ROLES.USER_GROUP.includes(role)) return <Navigate to="/portal/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
}

// ==================== 4. BẢO VỆ ROUTE THEO ROLE ====================
function RoleRoute({ allowedRoles, children }) {
  const userRole = getUserRole();
  
  // Chưa đăng nhập -> Đá về Login
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  
  // Đã đăng nhập nhưng sai quyền
  if (!userRole || !allowedRoles.includes(userRole)) {
     // Nếu Giảng viên cố vào trang Admin -> Đá về Portal
     if (ROLES.USER_GROUP.includes(userRole)) return <Navigate to="/portal/dashboard" replace />;
     // Nếu Admin cố vào trang Portal (tùy chọn) -> Đá về Admin Dashboard
     if (ROLES.ADMIN_GROUP.includes(userRole)) return <Navigate to="/dashboard" replace />;
     
     return <div className="alert alert-danger m-5">403 - Bạn không có quyền truy cập!</div>;
  }

  return children ? children : <Outlet />;
}

// ==================== APP CHÍNH ====================
export default function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const syncAuth = () => setIsAuth(isAuthenticated());
    window.addEventListener('storage', syncAuth);
    window.addEventListener('authChange', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('authChange', syncAuth);
    };
  }, []);

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Redirect thông minh --- */}
      <Route path="/" element={<HomeRedirect />} />

      {/* =======================================================
        LUỒNG 1: ADMIN & NHÂN VIÊN (Đường dẫn gốc)
        URL: /dashboard, /equipment, /users ...
        =======================================================
      */}
      <Route element={
        <RoleRoute allowedRoles={ROLES.ADMIN_GROUP}>
          <AdminLayout />
        </RoleRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/batch" element={<BatchPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/disposal" element={<DisposalPage />} />
        <Route path="/procurement" element={<ProcurementPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        
        {/* Trang cá nhân cho Admin */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* =======================================================
        LUỒNG 2: GIẢNG VIÊN / USER (Đường dẫn /portal)
        URL: /portal/dashboard, /portal/my-equipment ...
        =======================================================
      */}
      <Route path="/portal" element={
        <RoleRoute allowedRoles={ROLES.USER_GROUP}>
          <UserLayout onLogout={logout} />
        </RoleRoute>
      }>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="my-equipment" element={<UserEquipmentList />} />
        <Route path="create-proposal" element={<UserProcurement />} />
        <Route path="disposal-request" element={<UserDisposal />} />

        {/* Trang cá nhân cho Giảng viên */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Mặc định vào dashboard nếu gõ /portal */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* --- 404 Not Found --- */}
      <Route path="*" element={
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
          <div className="text-center">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="fs-3"> <span className="text-danger">Opps!</span> Không tìm thấy trang.</p>
            <p className="lead">Trang bạn đang tìm kiếm không tồn tại.</p>
            <a href="/" className="btn btn-primary">Về trang chủ</a>
          </div>
        </div>
      } />

    </Routes>
  );
}