import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { createUser } from "../../services/userService";
import { getFaculties } from "../../services/facultyService"; 

export default function UserCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dữ liệu dropdown
  const [roles, setRoles] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // Form State (Đã bỏ confirmPassword)
  const [formData, setFormData] = useState({
   
    hoTen: "",
    email: "",
    soDienThoai: "",
    password: "",
    maVaiTro: "",
    maDonVi: "",
    trangThai: "HOAT_DONG"
  });

  const [error, setError] = useState("");

  // 1. Fetch Metadata
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

  // 2. Mở Modal & Reset Form
  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      setError("");
      setFormData({
        hoTen: "", email: "", soDienThoai: "",
        password: "", // Chỉ cần 1 trường password
        maVaiTro: "", maDonVi: "", trangThai: "HOAT_DONG"
      });
    };
    window.addEventListener("openCreateUserModal", handler);
    return () => window.removeEventListener("openCreateUserModal", handler);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Form
  const handleSubmit = async () => {
    setError("");

   
  
    
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        
        ten_nd: formData.hoTen,
        email: formData.email,
        so_dien_thoai: formData.soDienThoai,
        mat_khau: formData.password,
        
        ma_vai_tro: formData.maVaiTro,
        ma_don_vi: formData.maDonVi || null,
        
        trang_thai: formData.trangThai
      };

      console.log("Create Payload:", payload);

      await createUser(payload);

      alert("Thêm người dùng thành công!");
      setIsOpen(false);
      
      // Reload bảng danh sách
      window.dispatchEvent(new Event("userUpdated"));

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Thêm mới thất bại. Vui lòng thử lại!");
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
            <h5 className="modal-title">Thêm người dùng mới</h5>
            <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
          </div>
          
          <div className="modal-body">
            {error && <div className="alert alert-danger p-2 small">{error}</div>}

            <div className="row g-3">
              {/* Họ tên */}
              <div className="col-6">
                <label className="form-label">Họ tên *</label>
                <input 
                    type="text" className="form-control" 
                    name="hoTen" value={formData.hoTen} onChange={handleChange} 
                    placeholder="Nhập họ tên"
                />
              </div>

          

              {/* Email */}
              <div className="col-6">
                <label className="form-label">Email *</label>
                <input 
                    type="email" className="form-control" 
                    name="email" value={formData.email} onChange={handleChange} 
                    placeholder="example@university.edu.vn"
                />
              </div>

              {/* Số điện thoại */}
              <div className="col-6">
                <label className="form-label">Số điện thoại</label>
                <input 
                    type="text" className="form-control" 
                    name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} 
                    placeholder="0901234567"
                />
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

              {/* Mật khẩu */}
              <div className="col-12">
                <label className="form-label">Mật khẩu *</label>
                <input 
                    type="" className="form-control" 
                    name="password" value={formData.password} onChange={handleChange} 
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                />
              </div>
            
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Thêm người dùng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}