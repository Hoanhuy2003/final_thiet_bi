import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; 
import { getToken, logout } from "../../services/authService";

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (event) => {
      setIsOpen(true);
      setError("");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      if (event.detail && event.detail.id) {
        setUserId(event.detail.id);
      }
    };

    window.addEventListener("openChangePasswordModal", handler);
    return () => window.removeEventListener("openChangePasswordModal", handler);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm kiểm tra độ mạnh mật khẩu
  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async () => {
    setError("");

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Mật khẩu mới phải ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!userId) {
      setError("Không tìm thấy ID người dùng. Vui lòng tải lại trang.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        oldPassword,
        newPassword,
      };

      // Gọi API change-password riêng, backend sẽ check oldPassword và hash newPassword
      await axiosInstance.post(`/api/nguoi_dung/${userId}/change-password`, payload, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
      });

      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setIsOpen(false);

      // Logout sau khi đổi pass
      logout();
      window.location.href = "/login";

    } catch (err) {
      console.error("Lỗi đổi pass:", err);
      const msg = err.response?.data?.message || "Đổi mật khẩu thất bại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Đổi mật khẩu</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            {error && <div className="alert alert-danger p-2 small">{error}</div>}
            
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  name="oldPassword"
                  className="form-control" 
                  placeholder="Nhập mật khẩu hiện tại"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Mật khẩu mới *</label>
                <input 
                  type="password" 
                  name="newPassword"
                  className="form-control" 
                  placeholder="Ít nhất 8 ký tự, chữ hoa, số, ký tự đặc biệt"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Xác nhận mật khẩu mới *</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="form-control" 
                  placeholder="Nhập lại mật khẩu mới" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
