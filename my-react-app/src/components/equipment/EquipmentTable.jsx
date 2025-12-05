import { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { equipmentService } from "../../services/equipmentService";
import toast from "react-hot-toast";

const statusColors = {
  "Đang sử dụng": "badge-success",
  "Bảo trì": "badge-warning",
  "Hỏng hóc": "badge-danger",
  "Chờ thanh lý": "badge-secondary",
};

export default function EquipmentTable() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll();
      setList(data);
    } catch (err) {
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

  // Áp dụng filter từ localStorage
  const filtered = list.filter(item => {
    const f = JSON.parse(localStorage.getItem("equipmentFilters") || "{}");
    const matchSearch = !f.search || item.maTB.includes(f.search) || item.tenTB.toLowerCase().includes(f.search.toLowerCase());
    const matchLoai = f.loai === "all" || item.loai === f.loai;
    const matchStatus = f.tinhTrang === "all" || item.tinhTrang === f.tinhTrang;
    const matchPhong = f.phong === "all" || item.phong === f.phong;
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

  if (loading) return <div className="text-center py-5">Đang tải...</div>;

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã TB</th>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th>Nguyên giá</th>
                <th>Giá trị hiện tại</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => (
                <tr key={eq.maTB}>
                  <td className="font-medium">{eq.maTB}</td>
                  <td>{eq.tenTB}</td>
                  <td>{eq.loai}</td>
                  <td>{eq.phong}</td>
                  <td>{eq.giaTriBanDau?.toLocaleString("vi-VN")}đ</td>
                  <td>{eq.giaTriHienTai?.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <span className={`badge ${statusColors[eq.tinhTrang] || "badge-secondary"}`}>
                      {eq.tinhTrang}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-link text-dark p-1" onClick={() => openDetail(eq)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-sm btn-link text-dark p-1" onClick={() => openEdit(eq)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-link text-danger p-1" onClick={() => openDisposal(eq)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}