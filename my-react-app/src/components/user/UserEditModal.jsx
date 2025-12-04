import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { updateUser } from "../../services/userService";
import { getFaculties } from "../../services/facultyService"; // Import service chuẩn

export default function UserEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // State Form
  const [formData, setFormData] = useState({
    id: "",
    hoTen: "",
    email: "",
    soDienThoai: "",
    maVaiTro: "", 
    maDonVi: "", 
    trangThai: "HOAT_DONG",
    username: ""
  });

  // 1. Fetch dữ liệu Dropdown
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const resRoles = await axiosInstance.get("/api/roles");
        setRoles(resRoles.data.result || resRoles.data || []);

        const resFaculties = await getFaculties();
        const list = Array.isArray(resFaculties.data) 
            ? resFaculties.data 
            : resFaculties.data.result || resFaculties.data.data || [];
        setFaculties(list);
      } catch (err) {
        console.error("Lỗi tải metadata:", err);
      }
    };
    fetchMetaData();
  }, []);

  // 2. Mở Modal & Map dữ liệu cũ
  useEffect(() => {
    const handler = () => {
      const data = localStorage.getItem("selectedUser");
      if (data) {
        const user = JSON.parse(data);
        
        // Logic lấy ID an toàn
        const currentMaDonVi = user.donVi ? (user.donVi.maDonVi || user.donVi.ma_don_vi || user.donVi.id) : "";
        const currentMaVaiTro = user.maVaiTro ? (user.maVaiTro.maVaiTro || user.maVaiTro.ma_vai_tro || user.maVaiTro.id) : "";
        const currentUsername = user.tenDangNhap || user.username || "";

        setFormData({
          id: user.maNguoiDung,
          hoTen: user.hoTen || user.ten_nd,
          email: user.email,
          soDienThoai: user.soDienThoai || user.so_dien_thoai || "",
          username: currentUsername,
          maVaiTro: currentMaVaiTro, 
          maDonVi: currentMaDonVi, 
          trangThai: user.trangThai || "HOAT_DONG"
        });
        setIsOpen(true);
      }
    };
    window.addEventListener("openEditUserModal", handler);
    return () => window.removeEventListener("openEditUserModal", handler);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ten_nd: formData.hoTen,
        email: formData.email,
        so_dien_thoai: formData.soDienThoai,
        ten_dang_nhap: formData.username,
        ma_don_vi: formData.maDonVi || null, 
        ma_vai_tro: formData.maVaiTro || null,
        trang_thai: formData.trangThai
      };

      await updateUser(formData.id, payload);
      alert("Cập nhật thành công!");
      setIsOpen(false);
      window.dispatchEvent(new Event("userUpdated")); 

    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.message || "Lỗi server"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa người dùng</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Họ tên *</label>
                <input type="text" className="form-control" name="hoTen" value={formData.hoTen} onChange={handleChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Email *</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
              </div>

              {/* Vai trò */}
              <div className="col-6">
                <label className="form-label">Vai trò *</label>
                <select className="form-select" name="maVaiTro" value={formData.maVaiTro} onChange={handleChange}>
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map(role => (
                    <option key={role.maVaiTro || role.ma_vai_tro} value={role.maVaiTro || role.ma_vai_tro}>
                        {role.tenVaiTro || role.ten_vai_tro}
                    </option>
                  ))}
                </select>
              </div>

              {/* Đơn vị */}
              <div className="col-6">
                <label className="form-label">Đơn vị</label>
                <select className="form-select" name="maDonVi" value={formData.maDonVi} onChange={handleChange}>
                  <option value="">-- Chọn đơn vị --</option>
                  {faculties.map(fac => (
                    <option key={fac.maDonVi || fac.ma_don_vi} value={fac.maDonVi || fac.ma_don_vi}>
                        {fac.tenDonVi || fac.ten_don_vi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" name="trangThai" value={formData.trangThai} onChange={handleChange}>
                  <option value="HOAT_DONG">Hoạt động</option>
                  <option value="KHOA">Đã khóa</option>
                  <option value="CHO_DUYET">Chờ duyệt</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Số điện thoại</label>
                <input type="text" className="form-control" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}