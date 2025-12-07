// src/components/UserLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import thêm Sidebar
import Header from './Header';

const UserLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex h-100">
      {/* Thêm Sidebar vào đây */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Header 
          isSidebarOpen={sidebarOpen} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={onLogout} 
          isUserLayout={true} 
        />
        
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          <Outlet />
        </main>
        
        <footer className="text-center py-2 text-muted border-top bg-white small">
           © 2025 UTC Equipment Portal
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;