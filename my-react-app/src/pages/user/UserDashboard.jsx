import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold text-primary">Tổng Quan Giảng Viên</h2>

      {/* Thẻ thống kê */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
              <h5 className="card-title text-muted">Thiết bị đang quản lý</h5>
              <p className="display-6 fw-bold text-dark mb-0">12</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4">
            <div className="card-body">
              <h5 className="card-title text-muted">Đề xuất đang chờ duyệt</h5>
              <p className="display-6 fw-bold text-dark mb-0">2</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-danger border-4">
            <div className="card-body">
              <h5 className="card-title text-muted">Thiết bị báo hỏng</h5>
              <p className="display-6 fw-bold text-dark mb-0">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Truy cập nhanh */}
      <h4 className="mb-3">Truy cập nhanh</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/portal/my-equipment" className="btn btn-outline-primary w-100 p-4 fw-bold">
            📋 Xem Danh Sách Thiết Bị
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/portal/create-proposal" className="btn btn-outline-success w-100 p-4 fw-bold">
            ➕ Tạo Đề Xuất Mua Mới
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/portal/disposal-request" className="btn btn-outline-danger w-100 p-4 fw-bold">
            🗑️ Tạo Yêu Cầu Thanh Lý
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;