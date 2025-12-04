// src/components/profile/ProfileInfoCard.jsx
import { useState, useEffect } from "react";
import { User, Mail, Phone, Building, Shield, Save } from "lucide-react";

// Đảm bảo đường dẫn import đúng (2 cấp ../)
import { getToken } from "../../services/authService";
import axiosInstance from "../../api/axiosInstance";

export default function ProfileInfoCard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- 1. STATE LƯU DỮ LIỆU ---
  const [userInfo, setUserInfo] = useState({
    id: "",           // ID dùng để gọi API
    ten_nd: "",       // Tên người dùng (Backend yêu cầu key là ten_nd)
    email: "",
    so_dien_thoai: "",
    username: "",     
    
    // Tách biệt ID và Tên hiển thị
    ma_don_vi: null,  
    ten_don_vi: "",   
    
    ma_vai_tro: null, 
    ten_vai_tro: "",  
  });

  // --- 2. FETCH DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log("--> Đang tải thông tin từ /myInfo...");
        const res = await axiosInstance.get("/api/nguoi_dung/myInfo", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const data = res.data.result || res.data;
        console.log("--> Dữ liệu nhận được:", data);

        // Map dữ liệu vào State
        setUserInfo({
          id: data.maNguoiDung,
          // Lưu ý: API trả về hoTen, nhưng ta lưu vào state ten_nd để lát gửi đi cho tiện
          ten_nd: data.hoTen || "", 
          email: data.email || "",
          so_dien_thoai: data.soDienThoai || "", 
          username: data.tenDangNhap || data.username || "",

          // Xử lý Đơn vị
          ma_don_vi: data.donVi ? (data.donVi.maDonVi || data.donVi) : null,
          ten_don_vi: data.donVi ? (data.donVi.tenDonVi || "Chưa cập nhật") : "",

          // Xử lý Vai trò
          ma_vai_tro: data.maVaiTro ? (data.maVaiTro.maVaiTro || data.maVaiTro) : null,
          ten_vai_tro: data.maVaiTro ? (data.maVaiTro.tenVaiTro || "Chưa cấp quyền") : "",
        });

      } catch (err) {
        console.error("xxx Lỗi lấy thông tin:", err);
      }
    };
    fetchUserInfo();
  }, []);

  // Lắng nghe sự kiện toggle từ Sidebar
  useEffect(() => {
    const toggleEditListener = () => setIsEditMode(prev => !prev);
    window.addEventListener("toggleEditMode", toggleEditListener);
    return () => window.removeEventListener("toggleEditMode", toggleEditListener);
  }, []);

  // --- 3. HÀM LƯU DỮ LIỆU (QUAN TRỌNG NHẤT) ---
  const handleSave = async () => {
    if (!userInfo.id) {
        alert("Lỗi Frontend: Không tìm thấy ID User. Hãy F5 tải lại trang!");
        return;
    }

    setLoading(true);
    try {
      // --- CHUẨN BỊ PAYLOAD (Sửa key sang snake_case) ---
      const payload = {
        ten_nd: userInfo.ten_nd,         // Backend đợi ten_nd (không phải hoTen)
        email: userInfo.email,
        so_dien_thoai: userInfo.so_dien_thoai, // Backend đợi so_dien_thoai
        
        ma_don_vi: userInfo.ma_don_vi,   // Backend đợi ma_don_vi
        ma_vai_tro: userInfo.ma_vai_tro, // Backend đợi ma_vai_tro
        
        // Các trường phụ trợ (giống JSON mẫu bạn cung cấp)
        trang_thai: "HOAT_DONG",
        ten_dang_nhap: userInfo.username 
      };

      console.log("-------------------------------------");
      console.log("CHECK API UPDATE:");
      console.log("1. URL:", `/api/nguoi_dung/${userInfo.id}`);
      console.log("2. Payload (Gửi đi):", payload);
      console.log("-------------------------------------");

      // Gọi API PUT
      await axiosInstance.put(`/api/nguoi_dung/${userInfo.id}`, payload, {
        headers: { 
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json" // Bắt buộc có header này
        },
      });

      console.log("--> Cập nhật thành công!");
      alert("Cập nhật thông tin thành công!");
      
      setIsEditMode(false);
      // Báo cho Sidebar cập nhật lại tên hiển thị bên trái
      window.dispatchEvent(new Event("profileUpdated")); 

    } catch (err) {
      console.error("xxx Lỗi khi lưu:", err);
      const svMsg = err.response?.data?.message || err.response?.data?.error || "Lỗi server";
      const status = err.response?.status;
      alert(`Cập nhật thất bại (Lỗi ${status}): ${svMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
        <h5 className="mb-0 fw-bold">Thông tin cá nhân</h5>
        
        {isEditMode && (
          <button 
            className="btn btn-sm btn-success d-flex align-items-center"
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang lưu...
                </>
            ) : (
                <>
                    <Save size={16} className="me-2" />
                    Lưu thay đổi
                </>
            )}
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="row g-3">
          {/* Họ tên */}
          <div className="col-12">
            <label className="form-label d-flex align-items-center gap-2">
              <User size={16} className="text-primary"/> 
              <span className="fw-semibold">Họ và tên</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={userInfo.ten_nd} // Map vào biến ten_nd
              onChange={(e) => setUserInfo({ ...userInfo, ten_nd: e.target.value })}
              disabled={!isEditMode}
            />
          </div>

          {/* Email */}
          <div className="col-12 col-md-6">
            <label className="form-label d-flex align-items-center gap-2">
              <Mail size={16} className="text-primary"/> 
              <span className="fw-semibold">Email</span>
            </label>
            <input 
                type="text" 
                className="form-control bg-light" 
                value={userInfo.email} 
                disabled 
            />
          </div>
          
          {/* Số điện thoại */}
          <div className="col-12 col-md-6">
             <label className="form-label d-flex align-items-center gap-2">
               <Phone size={16} className="text-primary"/> 
               <span className="fw-semibold">Số điện thoại</span>
             </label>
             <input
               type="text"
               className="form-control"
               value={userInfo.so_dien_thoai}
               onChange={(e) => setUserInfo({ ...userInfo, so_dien_thoai: e.target.value })}
               disabled={!isEditMode}
             />
           </div>

          {/* Đơn vị - Readonly */}
          <div className="col-12 col-md-6">
            <label className="form-label d-flex align-items-center gap-2">
              <Building size={16} className="text-muted"/> 
              <span className="fw-semibold text-muted">Đơn vị</span>
            </label>
            <input 
                type="text" 
                className="form-control bg-light" 
                value={userInfo.ten_don_vi} 
                disabled 
            />
          </div>

          {/* Vai trò - Readonly */}
          <div className="col-12 col-md-6">
            <label className="form-label d-flex align-items-center gap-2">
              <Shield size={16} className="text-muted"/> 
              <span className="fw-semibold text-muted">Vai trò</span>
            </label>
            <input 
                type="text" 
                className="form-control bg-light" 
                value={userInfo.ten_vai_tro} 
                disabled 
            />
          </div>
        </div>
      </div>
    </div>
  );
}