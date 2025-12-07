import { useState, useEffect } from "react";
import { Search, Filter, Building2 } from "lucide-react";
import roomService from "../../services/roomService"; // API phòng
import toast from "react-hot-toast";

export default function EquipmentFilters() {
  const [filters, setFilters] = useState({
    search: "",
    loai: "all",
    tinhTrang: "all",
    phong: "all",
  });

  const [danhSachPhong, setDanhSachPhong] = useState([]);
  const [loadingPhong, setLoadingPhong] = useState(true);

  // Lấy danh sách phòng từ backend
  useEffect(() => {
    const loadPhong = async () => {
      try {
        setLoadingPhong(true);
        const data = await roomService.getAll();
        setDanhSachPhong(data);
      } catch (err) {
        console.error("Lỗi tải danh sách phòng:", err);
        toast.error("Không tải được danh sách phòng");
        setDanhSachPhong([]);
      } finally {
        setLoadingPhong(false);
      }
    };
    loadPhong();
  }, []);

  // Lưu filter + thông báo thay đổi
  useEffect(() => {
    localStorage.setItem("equipmentFilters", JSON.stringify(filters));
    window.dispatchEvent(new Event("equipmentFilterChange"));
  }, [filters]);

  const reset = () => {
    setFilters({ search: "", loai: "all", tinhTrang: "all", phong: "all" });
    toast.success("Đã xóa bộ lọc");
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0 d-flex align-items-center gap-2 text-primary">
          <Filter size={20} />
          Bộ lọc thiết bị
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {/* Tìm kiếm */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-3 translate-middle-y text-muted" size={18} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm mã hoặc tên thiết bị..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Loại thiết bị */}
          <div className="col-12 col-md-6 col-lg-3">
            <select
              className="form-select"
              value={filters.loai}
              onChange={(e) => setFilters({ ...filters, loai: e.target.value })}
            >
              <option value="all">Tất cả loại</option>
              <option value="Máy tính để bàn">Máy tính để bàn</option>
              <option value="Laptop">Laptop</option>
              <option value="Máy chiếu Projector">Máy chiếu Projector</option>
              <option value="Máy in Laser">Máy in Laser</option>
              <option value="Máy lạnh">Máy lạnh</option>
              <option value="Bàn ghế học viên">Bàn ghế học viên</option>
              <option value="Tủ hồ sơ sắt">Tủ hồ sơ sắt</option>
              <option value="Camera an ninh">Camera an ninh</option>
              <option value="Tivi LCD 55 inch">Tivi LCD 55 inch</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div className="col-12 col-md-6 col-lg-2">
            <select
              className="form-select"
              value={filters.tinhTrang}
              onChange={(e) => setFilters({ ...filters, tinhTrang: e.target.value })}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Bảo trì">Bảo trì</option>
              <option value="Hỏng hóc">Hỏng hóc</option>
              <option value="Chờ thanh lý">Chờ thanh lý</option>
              <option value="Đã thanh lý">Đã thanh lý</option>
            </select>
          </div>

          {/* Phòng – LẤY TỪ API */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="position-relative">
              <Building2 className="position-absolute top-50 start-3 translate-middle-y text-muted" size={18} />
              <select
                className="form-select ps-5"
                value={filters.phong}
                onChange={(e) => setFilters({ ...filters, phong: e.target.value })}
                disabled={loadingPhong}
              >
                <option value="all">
                  {loadingPhong ? "Đang tải phòng..." : "Tất cả phòng"}
                </option>
                {danhSachPhong.map((phong) => (
                  <option key={phong.maPhong} value={phong.tenPhong}>
                    {phong.tenPhong} ({phong.maPhong})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút xóa bộ lọc */}
          <div className="col-12 col-lg-1 d-flex align-items-end">
            <button className="btn btn-outline-danger w-100" onClick={reset}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}