import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

export default function EquipmentFilters() {
  const [filters, setFilters] = useState({
    search: "",
    loai: "all",
    tinhTrang: "all",
    phong: "all",
  });

  // State lưu danh mục từ API
  const [dsLoai, setDsLoai] = useState([]);
  const [dsPhong, setDsPhong] = useState([]);

  // 1. Gọi API lấy danh mục (Chỉ chạy 1 lần khi load trang)
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong] = await Promise.all([
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong")
        ]);

        // Xử lý dữ liệu trả về (fallback mảng rỗng nếu lỗi)
        setDsLoai(resLoai.data.result || resLoai.data || []);
        setDsPhong(resPhong.data.result || resPhong.data || []);
        
      } catch (error) {
        console.error("Lỗi tải bộ lọc:", error);
      }
    };
    fetchMasterData();
  }, []);

  // 2. Lưu filter vào LocalStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("equipmentFilters", JSON.stringify(filters));
    window.dispatchEvent(new Event("equipmentFilterChange"));
  }, [filters]);

  const reset = () => {
    setFilters({ search: "", loai: "all", tinhTrang: "all", phong: "all" });
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 d-flex align-items-center gap-2 text-primary fw-bold">
          <Filter size={20} /> Bộ lọc tìm kiếm
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          
          {/* Tìm kiếm từ khóa */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Nhập mã hoặc tên thiết bị..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Lọc theo Loại (API) */}
          <div className="col-12 col-md-6 col-lg-2">
            <select 
              className="form-select" 
              value={filters.loai} 
              onChange={(e) => setFilters({ ...filters, loai: e.target.value })}
            >
              <option value="all">-- Tất cả loại --</option>
              {dsLoai.map((item) => (
                <option key={item.maLoai} value={item.tenLoai}> {/* Value là Tên để khớp với Table */}
                  {item.tenLoai}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Trạng thái (Cứng) */}
          <div className="col-12 col-md-6 col-lg-2">
            <select 
              className="form-select" 
              value={filters.tinhTrang} 
              onChange={(e) => setFilters({ ...filters, tinhTrang: e.target.value })}
            >
              <option value="all">-- Trạng thái --</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Hỏng hóc">Hỏng hóc</option>
              <option value="Chờ thanh lý">Chờ thanh lý</option>
              <option value="Đã thanh lý">Đã thanh lý</option>
            </select>
          </div>

          {/* Lọc theo Phòng (API) */}
          <div className="col-12 col-md-6 col-lg-2">
            <select 
              className="form-select" 
              value={filters.phong} 
              onChange={(e) => setFilters({ ...filters, phong: e.target.value })}
            >
              <option value="all">-- Tất cả phòng --</option>
              {dsPhong.map((p) => (
                <option key={p.maPhong} value={p.tenPhong}> {/* Value là Tên để khớp với Table */}
                  {p.tenPhong}
                </option>
              ))}
            </select>
          </div>

          {/* Nút Reset */}
          <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end">
            <button className="btn btn-light border w-100 text-muted" onClick={reset}>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}