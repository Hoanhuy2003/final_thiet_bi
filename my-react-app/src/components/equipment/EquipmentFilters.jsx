import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

export default function EquipmentFilters() {
  const [filters, setFilters] = useState({
    search: "",
    loai: "all",
    tinhTrang: "all",
    phong: "all",
  });

  useEffect(() => {
    localStorage.setItem("equipmentFilters", JSON.stringify(filters));
    window.dispatchEvent(new Event("equipmentFilterChange"));
  }, [filters]);

  const reset = () => {
    setFilters({ search: "", loai: "all", tinhTrang: "all", phong: "all" });
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0 d-flex align-items-center gap-2">
          <Filter size={20} /> Bộ lọc
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-3 translate-middle-y text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm mã/tên thiết bị..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-2">
            <select className="form-select" value={filters.loai} onChange={(e) => setFilters({ ...filters, loai: e.target.value })}>
              <option value="all">Tất cả loại</option>
              <option>Máy tính để bàn</option>
              <option>Máy chiếu Projector</option>
              <option>Laptop</option>
              <option>Bàn ghế học viên</option>
              <option>Tủ hồ sơ sắt</option>
              <option>Máy in Laser</option>
              <option>Máy photocopy</option>
              <option>Camera an ninh</option>
              <option>Tivi LCD 55 inch</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-2">
            <select className="form-select" value={filters.tinhTrang} onChange={(e) => setFilters({ ...filters, tinhTrang: e.target.value })}>
              <option value="all">Tất cả trạng thái</option>
              <option>Đang sử dụng</option>
              <option>Bảo trì</option>
              <option>Hỏng hóc</option>
              <option>Chờ thanh lý</option>
              <option>Đã thanh lý</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-2">
            <select className="form-select" value={filters.phong} onChange={(e) => setFilters({ ...filters, phong: e.target.value })}>
              <option value="all">Tất cả phòng</option>
              <option>Văn phòng HCQT</option>
              <option>Phòng quản lý KTX</option>
              <option>Thư viện tầng 1</option>
              <option>Phòng học 101</option>
              <option>Lab Lập trình Java</option>
              <option>Phòng thực hành Điện tử</option>
              <option>Xưởng Cơ khí CNC</option>
              <option>Phòng học Kinh tế vĩ mô</option>
              <option>Phòng Kế toán</option>
              <option>Phòng thí nghiệm Vật lý</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
            <button className="btn btn-outline-secondary w-100" onClick={reset}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}