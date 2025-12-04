import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function EquipmentFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Lưu filter vào localStorage để Table có thể đọc (cách đơn giản nhất mà không cần Context)
  localStorage.setItem("eq_searchTerm", searchTerm);
  localStorage.setItem("eq_categoryFilter", categoryFilter);
  localStorage.setItem("eq_statusFilter", statusFilter);
  localStorage.setItem("eq_departmentFilter", departmentFilter);

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0 d-flex align-items-center gap-2">
          <Filter size={20} />
          Bộ lọc
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg">
            <div className="position-relative">
              <Search
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "#64748b",
                }}
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm kiếm theo mã, tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Máy tính">Máy tính</option>
              <option value="Thiết bị dạy học">Thiết bị dạy học</option>
              <option value="Máy công cụ">Máy công cụ</option>
              <option value="Thiết bị văn phòng">Thiết bị văn phòng</option>
              <option value="Thiết bị thí nghiệm">Thiết bị thí nghiệm</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Hỏng hóc">Hỏng hóc</option>
              <option value="Chờ thanh lý">Chờ thanh lý</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg">
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">Tất cả đơn vị</option>
              <option value="Khoa CNTT">Khoa CNTT</option>
              <option value="Khoa Cơ khí">Khoa Cơ khí</option>
              <option value="Khoa Điện tử">Khoa Điện tử</option>
              <option value="Khoa Kinh tế">Khoa Kinh tế</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-auto">
            <button className="btn btn-outline-secondary w-100" onClick={handleReset}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}