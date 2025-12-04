// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, logout } from './services/authService';

import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';

// Các trang (đã thêm .jsx)
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

import DashboardPage from "./pages/DashboardPage.jsx";
import EquipmentPage from "./pages/EquipmentPage.jsx";
import BatchPage from "./pages/BatchPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import DisposalPage from "./pages/DisposalPage.jsx";
import ProcurementPage from "./pages/ProcurementPage.jsx";
import UsersPage from "./pages/UserPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// ProtectedRoute
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
}

// MainLayout
function MainLayout() {
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

// App
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
      {/* Trang login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Tất cả route được bảo vệ - bắt đầu từ "/" */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Trang chủ chính là Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Các trang khác */}
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/batch" element={<BatchPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/disposal" element={<DisposalPage />} />
        <Route path="/procurement" element={<ProcurementPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 404 cho mọi đường dẫn không khớp */}
        <Route path="*" element={
          <div className="p-5 text-center">
            <h2>404 - Không tìm thấy trang</h2>
            <p>URL bạn truy cập không tồn tại.</p>
          </div>
        } />
      </Route>

    </Routes>
  );
}