import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, CheckCircle, Lock, Unlock, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllUsers, deleteUser, updateUser } from "../../services/userService";

const roleColors = { "Admin": "badge-danger", "Quản trị hệ thống": "badge-danger", "Nhân viên thiết bị": "badge-primary", "Trưởng khoa": "badge-warning", "Giảng viên": "badge-info", "Người dùng": "badge-secondary" };
const statusColors = { "HOAT_DONG": "badge-success", "KHOA": "badge-danger", "CHO_DUYET": "badge-warning" };
const statusLabels = { "HOAT_DONG": "Hoạt động", "KHOA": "Đã khóa", "CHO_DUYET": "Chờ duyệt" };

const PAGE_SIZE = 10;

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter State
  const [filter, setFilter] = useState(() => {
    try {
      const saved = localStorage.getItem("userFilters");
      return saved ? JSON.parse(saved) : { search: "", vaiTro: null, donVi: null, trangThai: null };
    } catch {
      return { search: "", vaiTro: null, donVi: null, trangThai: null };
    }
  });

  // LOAD DATA
  const loadData = async (page = currentPage, filterParams = filter) => {
    try {
      setLoading(true);
      
      // Backend params mapping
      const params = {
        page: page,
        size: PAGE_SIZE,
        search: filterParams.search,
        vaiTro: filterParams.vaiTro,
        donVi: filterParams.donVi,
        trangThai: filterParams.trangThai
      };

      const res = await getAllUsers(page, PAGE_SIZE, params.search, params); // Gọi service đã sửa (xem phần Service bên dưới)
      
      // Xử lý kết quả trả về từ service (đã chuẩn hóa ở service)
      setUsers(res.data || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);

    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  // EFFECT
  useEffect(() => {
    loadData(currentPage, filter);
    // eslint-disable-next-line
  }, [filter, currentPage]);

  useEffect(() => {
    const handleFilterChange = () => {
      const saved = localStorage.getItem("userFilters");
      if (saved) {
        setFilter(JSON.parse(saved));
        setCurrentPage(0); // Reset về trang 1 khi lọc
      }
    };
    
    const handleReload = () => loadData(currentPage, filter);

    window.addEventListener("userFilterChange", handleFilterChange);
    window.addEventListener("userUpdated", handleReload); // Reload khi sửa/xóa
    
    return () => {
      window.removeEventListener("userFilterChange", handleFilterChange);
      window.removeEventListener("userUpdated", handleReload);
    };
    // eslint-disable-next-line
  }, [filter, currentPage]);

  // PAGINATION CONTROLS
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  // ACTIONS (Giữ nguyên logic cũ)
  const handleStatusChange = async (user, newStatus, actionName) => {
    if (window.confirm(`Bạn muốn ${actionName} tài khoản "${user.hoTen}"?`)) {
      try {
        const payload = { ...user, trang_thai: newStatus }; // Payload rút gọn, service lo phần mapping chi tiết nếu cần
        // Lưu ý: Logic mapping payload chi tiết nên nằm trong hàm updateUserStatus của service để code gọn hơn
        // Ở đây giả định bạn dùng hàm cũ:
        const fullPayload = {
             ten_nd: user.hoTen, email: user.email, so_dien_thoai: user.soDienThoai || "",
             ten_dang_nhap: user.tenDangNhap || user.username,
             ma_don_vi: user.donVi?.maDonVi, ma_vai_tro: user.maVaiTro?.maVaiTro,
             trang_thai: newStatus 
        };
        await updateUser(user.maNguoiDung, fullPayload);
        alert(`Đã ${actionName} thành công!`);
        loadData(currentPage, filter);
      } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể cập nhật"));
      }
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Xóa người dùng "${user.hoTen}"?`)) {
      try {
        await deleteUser(user.maNguoiDung);
        alert("Xóa thành công!");
        loadData(currentPage, filter);
      } catch (error) { alert("Xóa thất bại!"); }
    }
  };

  const openDetail = (user) => { localStorage.setItem("selectedUser", JSON.stringify(user)); window.dispatchEvent(new Event("openDetailUserModal")); };
  const openEdit = (user) => { localStorage.setItem("selectedUser", JSON.stringify(user)); window.dispatchEvent(new Event("openEditUserModal")); };

  if (loading) return <div className="p-4 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-primary">Danh sách người dùng</h5>
        <span className="badge bg-light text-dark border">Tổng: {totalElements}</span>
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
                    <td className="fw-medium">{user.hoTen}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge ${roleColors[user.maVaiTro?.tenVaiTro] || 'badge-secondary'}`}>{user.maVaiTro?.tenVaiTro || "-"}</span></td>
                    <td>{user.donVi?.tenDonVi || "-"}</td>
                    <td><span className={`badge ${statusColors[user.trangThai] || 'badge-secondary'}`}>{statusLabels[user.trangThai] || user.trangThai}</span></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Các nút hành động giữ nguyên */}
                        {user.trangThai === 'CHO_DUYET' && (
                          <button className="btn btn-sm btn-link text-success p-1" onClick={() => handleStatusChange(user, "HOAT_DONG", "duyệt")}><CheckCircle size={18} /></button>
                        )}
                        {user.trangThai !== 'CHO_DUYET' && (
                           <button className={`btn btn-sm btn-link p-1 ${user.trangThai === 'HOAT_DONG' ? 'text-danger' : 'text-success'}`} onClick={() => handleStatusChange(user, user.trangThai === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG', user.trangThai === 'HOAT_DONG' ? 'khóa' : 'mở khóa')}>
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
                <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Footer */}
      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
        <small className="text-muted">Trang {currentPage + 1} trên {totalPages || 1}</small>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}><ChevronLeft size={16} /></button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages - 1}><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}