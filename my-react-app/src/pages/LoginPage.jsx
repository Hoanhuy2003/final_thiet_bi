// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(userName.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary bg-gradient">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '460px', maxWidth: '90vw' }}>
        <div className="card-body p-5">

          {/* Logo + Tiêu đề */}
          <div className="text-center mb-5">
            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" 
                 style={{ width: '80px', height: '80px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <i className="bi bi-hospital fs-1 text-primary"></i>
            </div>
            <h3 className="fw-bold text-primary mb-1">QUẢN LÝ TRANG THIẾT BỊ</h3>
            <p className="text-muted">Hệ thống quản lý thiết bị trường đại học</p>
          </div>

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-person me-2"></i>Tên đăng nhập
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Nhập tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-lock me-2"></i>Mật khẩu
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Phần chuyển sang Đăng ký */}
          <div className="text-center mt-4">
            <p className="text-muted mb-2">
              Chưa có tài khoản?
            </p>
            <Link
              to="/register"
              className="btn btn-outline-success btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-person-plus"></i>
              Đăng ký tài khoản mới
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-muted small">
            © 2025 Hệ thống quản lý thiết bị
          </div>
        </div>
      </div>
    </div>
  );
}