import { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "bg-success text-white", // Sửa class bootstrap chuẩn
  "Bảo trì": "bg-warning text-dark",
  "Hỏng hóc": "bg-danger text-white",
  "Chờ thanh lý": "bg-secondary text-white",
};

export default function EquipmentTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data từ API
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await equipmentService.getAll();
      
      // Kiểm tra cấu trúc trả về: res.data hoặc res.data.result
      // (Tùy backend của bạn, nếu trả về ApiResponse thì lấy .result)
      const data = res.data?.result || res.data || res || []; 
      
      // Đảm bảo data là mảng
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
    const handler = () => loadData();
    window.addEventListener("equipmentFilterChange", handler);
    return () => window.removeEventListener("equipmentFilterChange", handler);
  }, []);

  // Lọc dữ liệu (Client-side filtering)
  const filtered = list.filter(item => {
    const f = JSON.parse(localStorage.getItem("equipmentFilters") || "{}");
    const searchText = f.search?.toLowerCase() || "";
    
    // Lấy giá trị an toàn từ nested object để so sánh
    const tenLoai = item.loaiThietBi?.tenLoai || item.loai || "";
    const tenPhong = item.phong?.tenPhong || item.phong || "";

    const matchSearch = !searchText || 
      item.maTB?.toLowerCase().includes(searchText) || 
      item.tenTB?.toLowerCase().includes(searchText);
      
    const matchLoai = !f.loai || f.loai === "all" || tenLoai === f.loai;
    const matchStatus = !f.tinhTrang || f.tinhTrang === "all" || item.tinhTrang === f.tinhTrang;
    const matchPhong = !f.phong || f.phong === "all" || tenPhong === f.phong;

    return matchSearch && matchLoai && matchStatus && matchPhong;
  });

  const openDetail = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openDetailEquipmentModal"));
  };

  const openEdit = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openEditEquipmentModal"));
  };

  const openDisposal = (eq) => {
    localStorage.setItem("selectedEquipment", JSON.stringify(eq));
    window.dispatchEvent(new Event("openDisposalModal"));
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-secondary">
              <tr>
                <th className="ps-3">Mã TB</th>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th>Nguyên giá</th>
                <th>Giá trị HT</th>
                <th>Trạng thái</th>
                <th className="text-end pe-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    Không tìm thấy thiết bị nào.
                  </td>
                </tr>
              ) : (
                filtered.map((eq) => (
                  <tr key={eq.maTB}>
                    <td className="ps-3 fw-bold text-primary" style={{fontSize: '0.9rem'}}>
                      {eq.maTB}
                    </td>
                    <td className="fw-semibold">
                      {eq.tenTB}
                    </td>
                    <td>
                      {/* Hiển thị Loại (Ưu tiên object con) */}
                      {eq.loaiThietBi?.tenLoai || eq.loai || "-"}
                    </td>
                    <td>
                      {/* Hiển thị Phòng (Ưu tiên object con) */}
                      <span className="badge bg-light text-dark border">
                        {eq.phong?.tenPhong || eq.phong || "Kho"}
                      </span>
                    </td>
                    <td className="text-success small">
                      {eq.giaTriBanDau?.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="text-primary small">
                      {eq.giaTriHienTai?.toLocaleString("vi-VN")}đ
                    </td>
                    <td>
                      <span className={`badge rounded-pill fw-normal ${statusColors[eq.tinhTrang] || "bg-secondary text-white"}`}>
                        {eq.tinhTrang}
                      </span>
                    </td>
                    <td className="text-end pe-3">
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
                          className="btn btn-sm btn-light text-danger" 
                          title="Thanh lý / Xóa"
                          onClick={() => openDisposal(eq)}
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