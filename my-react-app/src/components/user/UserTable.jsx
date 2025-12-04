// src/components/user/UserTable.jsx
import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, CheckCircle, Lock, Unlock } from "lucide-react";
import { getAllUsers, deleteUser, updateUser } from "../../services/userService";

const roleColors = {
  "Admin": "badge-danger",
  "Quản trị hệ thống": "badge-danger",
  "Nhân viên thiết bị": "badge-primary",
  "Trưởng khoa": "badge-warning",
  "Giảng viên": "badge-info",
  "Người dùng": "badge-secondary",
};

const statusColors = {
  "HOAT_DONG": "badge-success",
  "KHOA": "badge-danger",
  "CHO_DUYET": "badge-warning"
};

const statusLabels = {
  "HOAT_DONG": "Hoạt động",
  "KHOA": "Đã khóa",
  "CHO_DUYET": "Chờ duyệt"
};

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm load dữ liệu
  const fetchUsers = async () => {
    try {
      // Tắt loading để không bị nháy khi reload ngầm
      // setLoading(true); 
      const res = await getAllUsers(0, 100); 
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Chỉ hiện loading lần đầu
    fetchUsers();

    // Lắng nghe sự kiện update từ Modal
    const handleReload = () => {
      console.log("♻️ Tải lại bảng...");
      fetchUsers(); 
    };
    window.addEventListener("userUpdated", handleReload);
    return () => window.removeEventListener("userUpdated", handleReload);
  }, []);

  // --- HÀM XỬ LÝ ĐỔI TRẠNG THÁI ---
  const handleStatusChange = async (user, newStatus, actionName) => {
    if (window.confirm(`Bạn muốn ${actionName} tài khoản "${user.hoTen}"?`)) {
      try {
        const payload = {
          ten_nd: user.hoTen,
          email: user.email,
          so_dien_thoai: user.soDienThoai || "",
          ten_dang_nhap: user.tenDangNhap || user.username,
          ma_don_vi: user.donVi ? (user.donVi.maDonVi || user.donVi.ma_don_vi) : null,      
          ma_vai_tro: user.maVaiTro ? (user.maVaiTro.maVaiTro || user.maVaiTro.ma_vai_tro) : null, 
          trang_thai: newStatus 
        };

        await updateUser(user.maNguoiDung, payload);
        alert(`Đã ${actionName} thành công!`);
        fetchUsers(); 
      } catch (error) {
        console.error(error);
        alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật"));
      }
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Xóa người dùng "${user.hoTen}"?`)) {
      try {
        await deleteUser(user.maNguoiDung);
        alert("Xóa thành công!");
        fetchUsers();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const openDetail = (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user));
    window.dispatchEvent(new Event("openDetailUserModal"));
  };

  const openEdit = (user) => {
    localStorage.setItem("selectedUser", JSON.stringify(user));
    window.dispatchEvent(new Event("openEditUserModal"));
  };

  if (loading) return <div className="p-4 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Danh sách người dùng</h5>
        <span className="badge bg-secondary">Tổng: {users.length}</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đơn vị</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.maNguoiDung}>
                    
                    <td>{user.hoTen}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${roleColors[user.maVaiTro?.tenVaiTro] || 'badge-secondary'}`}>
                        {user.maVaiTro?.tenVaiTro || "Chưa phân quyền"}
                      </span>
                    </td>
                    <td>{user.donVi?.tenDonVi || "-"}</td>
                    <td>
                      <span className={`badge ${statusColors[user.trangThai] || 'badge-secondary'}`}>
                        {statusLabels[user.trangThai] || user.trangThai}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {user.trangThai === 'CHO_DUYET' && (
                          <button className="btn btn-sm btn-link text-success p-1" onClick={() => handleStatusChange(user, "HOAT_DONG", "duyệt")} title="Duyệt">
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {user.trangThai !== 'CHO_DUYET' && (
                           <button className={`btn btn-sm btn-link p-1 ${user.trangThai === 'HOAT_DONG' ? 'text-danger' : 'text-success'}`}
                              onClick={() => {
                                const newStt = user.trangThai === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG';
                                const act = user.trangThai === 'HOAT_DONG' ? 'khóa' : 'mở khóa';
                                handleStatusChange(user, newStt, act);
                              }}
                              title={user.trangThai === 'HOAT_DONG' ? "Khóa" : "Mở khóa"}
                           >
                             {user.trangThai === 'HOAT_DONG' ? <Lock size={18} /> : <Unlock size={18} />}
                           </button>
                        )}
                        <button className="btn btn-sm btn-link text-info p-1" onClick={() => openDetail(user)}><Eye size={18} /></button>
                        <button className="btn btn-sm btn-link text-warning p-1" onClick={() => openEdit(user)}><Edit size={18} /></button>
                        <button className="btn btn-sm btn-link text-danger p-1" onClick={() => handleDelete(user)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}