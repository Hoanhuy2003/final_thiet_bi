import { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const mockEquipment = [
  {
    id: 1,
    ma_tai_san: "TB-2024-001",
    ten_thiet_bi: "Máy tính Dell Latitude 5420",
    loai: "Máy tính",
    don_vi: "Khoa CNTT",
    phong: "Lab A101",
    nguyen_gia: 18500000,
    gia_tri_con_lai: 14800000,
    trang_thai: "Đang sử dụng",
    ngay_mua: "2024-01-15",
  },
  {
    id: 2,
    ma_tai_san: "TB-2024-002",
    ten_thiet_bi: "Máy chiếu Sony VPL-EX455",
    loai: "Thiết bị dạy học",
    don_vi: "Khoa Cơ khí",
    phong: "Phòng 203",
    nguyen_gia: 25000000,
    gia_tri_con_lai: 18750000,
    trang_thai: "Đang sử dụng",
    ngay_mua: "2023-09-20",
  },
  {
    id: 3,
    ma_tai_san: "TB-2023-145",
    ten_thiet_bi: "Máy CNC 3 trục",
    loai: "Máy công cụ",
    don_vi: "Khoa Cơ khí",
    phong: "Xưởng thực hành",
    nguyen_gia: 450000000,
    gia_tri_con_lai: 360000000,
    trang_thai: "Bảo trì",
    ngay_mua: "2023-03-10",
  },
  {
    id: 4,
    ma_tai_san: "TB-2022-089",
    ten_thiet_bi: "Máy in HP LaserJet Pro",
    loai: "Thiết bị văn phòng",
    don_vi: "Khoa Kinh tế",
    phong: "Văn phòng khoa",
    nguyen_gia: 8500000,
    gia_tri_con_lai: 4250000,
    trang_thai: "Hỏng hóc",
    ngay_mua: "2022-06-15",
  },
  {
    id: 5,
    ma_tai_san: "TB-2021-234",
    ten_thiet_bi: "Bộ thí nghiệm điện tử",
    loai: "Thiết bị thí nghiệm",
    don_vi: "Khoa Điện tử",
    phong: "Lab B205",
    nguyen_gia: 35000000,
    gia_tri_con_lai: 17500000,
    trang_thai: "Đang sử dụng",
    ngay_mua: "2021-11-08",
  },
];

const statusColors = {
  "Đang sử dụng": "badge-success",
  "Bảo trì": "badge-warning",
  "Hỏng hóc": "badge-danger",
  "Chờ thanh lý": "badge-secondary",
};

export default function EquipmentTable() {
  const [filteredEquipment, setFilteredEquipment] = useState(mockEquipment);

  useEffect(() => {
    const updateFilter = () => {
      const search = (localStorage.getItem("eq_searchTerm") || "").toLowerCase();
      const category = localStorage.getItem("eq_categoryFilter") || "all";
      const status = localStorage.getItem("eq_statusFilter") || "all";
      const department = localStorage.getItem("eq_departmentFilter") || "all";

      const filtered = mockEquipment.filter((eq) => {
        const matchSearch =
          eq.ma_tai_san.toLowerCase().includes(search) ||
          eq.ten_thiet_bi.toLowerCase().includes(search);
        const matchCategory = category === "all" || eq.loai === category;
        const matchStatus = status === "all" || eq.trang_thai === status;
        const matchDepartment = department === "all" || eq.don_vi === department;
        return matchSearch && matchCategory && matchStatus && matchDepartment;
      });

      setFilteredEquipment(filtered);
    };

    updateFilter();
    window.addEventListener("storage", updateFilter);
    return () => window.removeEventListener("storage", updateFilter);
  }, []);

  const openDetail = (eq) => localStorage.setItem("selectedEquipment", JSON.stringify(eq)) || window.dispatchEvent(new Event("openDetailModal"));
  const openEdit = (eq) => localStorage.setItem("selectedEquipment", JSON.stringify(eq)) || window.dispatchEvent(new Event("openEditModal"));
  const openDisposal = (eq) => localStorage.setItem("selectedEquipment", JSON.stringify(eq)) || window.dispatchEvent(new Event("openDisposalModal"));

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Mã tài sản</th>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Đơn vị</th>
                <th>Phòng</th>
                <th>Nguyên giá</th>
                <th>Giá trị còn lại</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td className="font-medium">{eq.ma_tai_san}</td>
                  <td>{eq.ten_thiet_bi}</td>
                  <td>{eq.loai}</td>
                  <td>{eq.don_vi}</td>
                  <td>{eq.phong}</td>
                  <td>{eq.nguyen_gia.toLocaleString("vi-VN")}đ</td>
                  <td>{eq.gia_tri_con_lai.toLocaleString("vi-VN")}đ</td>
                  <td>
                    <span className={`badge ${statusColors[eq.trang_thai]}`}>
                      {eq.trang_thai}
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