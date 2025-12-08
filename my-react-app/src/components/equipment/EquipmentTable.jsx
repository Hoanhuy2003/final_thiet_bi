import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, DollarSign } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success text-white",
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger text-white",
  "Chờ thanh lý": "bg-secondary text-white",
};

export default function EquipmentTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await equipmentService.getAll();
      const data = res.data?.result || res.data || res || [];
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load bảng:", err);
      toast.error("Lỗi tải dữ liệu thiết bị");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xem chi tiết
  const openDetail = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openDetailEquipmentModal"));
  };

  // Chỉnh sửa
  const openEdit = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openEditEquipmentModal"));
  };

  // Xóa thiết bị
  const handleDelete = async (maTB) => {
    if (!window.confirm(`Xác nhận xóa thiết bị ${maTB}?`)) return;

    try {
      await equipmentService.delete(maTB);
      toast.success("Xóa thành công!");
      loadData(); // Reload bảng
    } catch (err) {
      toast.error("Xóa thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  // Thanh lý thiết bị (mở modal tạo phiếu và pre-add TB)
  const openDisposal = (eq) => {
    // 1. Lưu thiết bị vào localStorage
    localStorage.setItem("selectedThietBiForThanhLy", JSON.stringify(eq));
    
    // 2. CHUYỂN HƯỚNG SANG TRANG THANH LÝ
    window.location.href = "/disposal"; // Hoặc dùng router.navigate nếu dùng React Router
    
    // 3. MỞ MODAL TẠO PHIẾU (sẽ được trigger bởi useEffect trong modal)
    // Modal sẽ tự mở khi trang load xong
  };

  if (loading) return <div className="text-center py-5">Đang tải dữ liệu...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Danh sách thiết bị</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã TB</th>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th>Giá trị ban đầu</th>
                <th>Giá trị hiện tại</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    Chưa có thiết bị nào
                  </td>
                </tr>
              ) : (
                list.map((eq) => (
                  <tr key={eq.maTB}>
                    <td className="fw-semibold text-primary">{eq.maTB}</td>
                    <td>{eq.tenTB}</td>
                    <td>{eq.loai}</td>
                    <td>{eq.phong}</td>
                    <td className="text-end">{eq.giaTriBanDau?.toLocaleString("vi-VN") || 0} đ</td>
                    <td className="text-end">{eq.giaTriHienTai?.toLocaleString("vi-VN") || 0} đ</td>
                    <td>
                      <span className={`badge ${statusColors[eq.tinhTrang] || "bg-secondary"}`}>
                        {eq.tinhTrang}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button 
                          className="btn btn-sm btn-light text-primary" 
                          title="Xem chi tiết"
                          onClick={() => openDetail(eq)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-light text-dark" 
                          title="Chỉnh sửa"
                          onClick={() => openEdit(eq)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-light text-warning" 
                          title="Thanh lý"
                          onClick={() => openDisposal(eq)}
                        >
                          <DollarSign size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-light text-danger" 
                          title="Xóa"
                          onClick={() => handleDelete(eq.maTB)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}