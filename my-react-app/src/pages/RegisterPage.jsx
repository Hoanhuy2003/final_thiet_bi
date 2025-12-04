// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { getFaculties } from '../services/facultyService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    faculty: '',
    role: 'GIANGVIEN',
  });

  const [faculties, setFaculties] = useState([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // fetch danh sách khoa từ backend
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await getFaculties();
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setFaculties(list);
      } catch (err) {
        console.error('Không lấy được danh sách khoa:', err);
        setFaculties([]);
      } finally {
        setLoadingFaculties(false);
      }
    };
    fetchFaculties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validate
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.faculty) {
      setError('Vui lòng điền đầy đủ các trường có dấu *');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
  await register({
    ten_nd: formData.fullName,
    email: formData.email,
    mat_khau: formData.password,
    ma_don_vi: formData.faculty,
    ma_vai_tro: formData.role,
  });
  alert('Đăng ký thành công!\nVui lòng chờ quản trị viên duyệt tài khoản trong vòng 24h.');
  navigate('/login');
} catch (err) {
  setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary bg-gradient">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '540px', maxWidth: '92vw' }}>
        <div className="card-body p-5">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                 style={{ width: '85px', height: '85px', boxShadow: '0 6px 25px rgba(0,0,0,0.15)' }}>
              <i className="bi bi-mortarboard-fill fs-1 text-primary"></i>
            </div>
            <h3 className="fw-bold text-primary mb-1">ĐĂNG KÝ TÀI KHOẢN</h3>
            <p className="text-muted">Hệ thống quản lý trang thiết bị - Trường Đại học XYZ</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Họ và tên */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <i className="bi bi-person-fill me-2"></i>Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control form-control-lg"
                  placeholder="Nhập tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <i className="bi bi-envelope-at me-2"></i>Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Khoa */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <i className="bi bi-building me-2"></i>Khoa / Bộ môn <span className="text-danger">*</span>
                </label>
                {loadingFaculties ? (
                  <div>Đang tải danh sách khoa...</div>
                ) : (
                  <select
                    name="faculty"
                    className="form-select form-select-lg"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn khoa --</option>
                    {faculties.map((f) => (
                    <option key={f.maDonVi} value={f.maDonVi}>
                     {f.tenDonVi}
                     </option>
                    )   )}
                  </select>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-lock-fill me-2"></i>Mật khẩu <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Ít nhất 6 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <i className="bi bi-lock-fill me-2"></i>Nhập lại mật khẩu <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center mt-4 py-3">
                <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                <div>{error}</div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success btn-lg w-100 fw-bold mt-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Đang gửi yêu cầu...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill"></i>
                  Đăng ký tài khoản
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <div className="text-center mt-4 text-muted small">
            © 2025 Hệ thống Quản lý Trang thiết bị - Trường Đại học XYZ
          </div>
        </div>
      </div>
    </div>
  );
}
