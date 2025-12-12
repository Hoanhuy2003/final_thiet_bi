import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, logout, getUserRole } from './services/authService';

// Layouts
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import UserLayout from './components/UserLayout.jsx';

// Pages - Auth
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Pages - Shared
import ProfilePage from "./pages/ProfilePage.jsx";

// Pages - Quản trị
import DashboardPage from "./pages/DashboardPage.jsx";
import EquipmentPage from "./pages/EquipmentPage.jsx";
import ProcurementPage from "./pages/ProcurementPage.jsx";
import BatchPage from "./pages/BatchPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import DisposalPage from "./pages/DisposalPage.jsx";
import UsersPage from "./pages/UserPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

// Pages - Giảng viên
import UserDashboard from "./pages/user/UserDashboard.jsx";
import UserEquipmentList from "./pages/user/UserEquipmentList.jsx";
import UserProcurement from "./pages/user/UserProcurement.jsx";
import UserDisposal from "./pages/user/UserDisposal.jsx";

// ==================== ĐỊNH NGHĨA ROLE ====================
const ROLES = {
  ADMIN: 'ADMIN',
  NHANVIENTHIETBI: 'NHANVIENTHIETBI',     // Nhân viên thiết bị
  NHANVIENKIEMKE: 'NHANVIENKIEMKE',       // Nhân viên kiểm kê
  NHANVIENMUASAM: 'NHANVIENMUASAM',        // Nhân viên mua sắm
  TRUONGKHOA: ['GIANGVIEN']
};

// Kiểm tra quyền toàn cục (Admin + lãnh đạo)
const hasFullAccess = (role) => ['ADMIN'].includes(role);

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ allowedRoles = [], children }) {
  const userRole = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles.includes(userRole) || hasFullAccess(userRole);

  if (!isAllowed) {
    if (ROLES.TRUONGKHOA.includes(userRole)) {
      return <Navigate to="/portal/dashboard" replace />;
    }

    return (
      <div className="container-fluid py-5">
        <div className="alert alert-danger text-center">
          <h4>403 - Truy cập bị từ chối</h4>
          <p>Bạn không có quyền truy cập trang này.</p>
          <a href="/dashboard" className="btn btn-primary mt-3">Quay lại trang chủ</a>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}

// ==================== ADMIN LAYOUT (chỉ render nếu có quyền vào ít nhất 1 trang) ====================
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleLogout = () => logout();

  return (
    <div className="d-flex h-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Header
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onLogout={handleLogout}
          isUserLayout={false}
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

// ==================== HOME REDIRECT ====================
function HomeRedirect() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const role = getUserRole();

  if (hasFullAccess(role) || 
      role === 'NHANVIENTHIETBI' || 
      role === 'NHANVIENKIEMKE' || 
      role === 'NHANVIENTHANHLY' ||
      role === 'NHANVIENMUASAM') {
    return <Navigate to="/dashboard" replace />;
  }

  if (ROLES.TRUONGKHOA.includes(role)) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

// ==================== APP ====================
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomeRedirect />} />

      {/* ==================== ADMIN & NHÂN VIÊN ==================== */}
      <Route element={<AdminLayout />}>
        {/* Dashboard - tất cả nhân viên đều được vào */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['NHANVIENTHIETBI', 'NHANVIENKIEMKE', 'NHANVIENMUASAM', 'NHANVIENTHANHLY']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Nhân viên thiết bị: Thiết bị + Lô */}
        <Route path="/equipment" element={
          <ProtectedRoute allowedRoles={['NHANVIENTHIETBI']}>
            <EquipmentPage />
          </ProtectedRoute>
        } />
        <Route path="/batch" element={
          <ProtectedRoute allowedRoles={['NHANVIENTHIETBI']}>
            <BatchPage />
          </ProtectedRoute>
        } />

        {/* Nhân viên kiểm kê */}
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={['NHANVIENKIEMKE']}>
            <InventoryPage />
          </ProtectedRoute>
        } />

        {/* Nhân viên mua sắm */}
        <Route path="/procurement" element={
          <ProtectedRoute allowedRoles={['NHANVIENMUASAM']}>
            <ProcurementPage />
          </ProtectedRoute>
        } />

        {/* Nhân viên thanh lý */}
        <Route path="/disposal" element={
          <ProtectedRoute allowedRoles={['NHANVIENTHANHLY']}> 
            <DisposalPage />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={[]}>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={[]}>
            <ReportsPage />
          </ProtectedRoute>
        } />

        {/* Profile - tất cả nhân viên */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ==================== Trưởng khoa ==================== */}
      <Route path="/portal" element={
        <ProtectedRoute allowedRoles={ROLES.TRUONGKHOA}>
          <UserLayout onLogout={logout} />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="my-equipment" element={<UserEquipmentList />} />
        <Route path="create-proposal" element={<UserProcurement />} />
        <Route path="disposal-request" element={<UserDisposal />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
          <div className="text-center">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="fs-3"><span className="text-danger">Oops!</span> Không tìm thấy trang.</p>
            <a href="/" className="btn btn-primary">Về trang chủ</a>
          </div>
        </div>
      } />
    </Routes>
  );
}