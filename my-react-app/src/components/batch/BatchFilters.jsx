import { useState, useEffect, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Select from "react-select";
import toast from "react-hot-toast";

export default function BatchFilters() {
  // Khởi tạo state filter từ LocalStorage
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem("batchFilters");
      // Thêm trường 'maLoai' để lọc theo Loại
      return saved ? JSON.parse(saved) : { search: "", maNCC: "all", maLoai: "all" };
    } catch {
      return { search: "", maNCC: "all", maLoai: "all" };
    }
  });

  const [nccOptions, setNccOptions] = useState([]);
  const [loaiOptions, setLoaiOptions] = useState([]); // THÊM STATE CHO LOẠI THIẾT BỊ

  // 1. Load danh sách Nhà cung cấp và Loại thiết bị
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resNCC, resLoai] = await Promise.all([
          axiosInstance.get("/api/nha_cung_cap"),
          axiosInstance.get("/api/loai_thiet_bi") // Gọi API Loại thiết bị
        ]);

        // Xử lý NCC
        const rawNCC = resNCC.data.result || resNCC.data || [];
        setNccOptions([
          { value: "all", label: "-- Tất cả Nhà cung cấp --" },
          ...rawNCC.map(n => ({ value: n.maNhaCungCap, label: n.ten || n.tenNhaCungCap }))
        ]);
        
        // Xử lý Loại thiết bị
        const rawLoai = resLoai.data.result || resLoai.data || [];
        setLoaiOptions([
             { value: "all", label: "-- Tất cả Loại thiết bị --" },
             ...rawLoai.map(l => ({ value: l.maLoai, label: l.tenLoai }))
        ]);

      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchMasterData();
  }, []);

  // 2. Lưu filter vào LocalStorage và bắn sự kiện
  useEffect(() => {
    localStorage.setItem("batchFilters", JSON.stringify(filters));
    window.dispatchEvent(new Event("batchFilterChange"));
  }, [filters]);

  const resetFilters = () => {
    setFilters({ search: "", maNCC: "all", maLoai: "all" });
    toast.success("Đã xóa bộ lọc");
  };

  // Helper tìm Object từ value (để hiển thị trong Select)
  const getValueObj = (options, value) => options.find(op => String(op.value) === String(value)) || null;

  // Style cho React-Select
  const customStyles = {
    control: (base) => ({ ...base, borderColor: "#dee2e6", minHeight: "38px" }),
    menu: (base) => ({ ...base, zIndex: 1050 })
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 d-flex align-items-center gap-2 text-primary fw-bold">
          <Filter size={20} /> Bộ lọc Lô hàng
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-end">
          
          {/* 1. Tìm kiếm từ khóa */}
          <div className="col-12 col-md-3">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm mã lô, tên lô..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* 2. Lọc theo Loại thiết bị (MỚI) */}
          <div className="col-12 col-md-3">
            <label className="form-label small text-muted mb-1 d-block">Loại thiết bị</label>
            <Select 
                options={loaiOptions}
                value={getValueObj(loaiOptions, filters.maLoai)}
                onChange={(opt) => setFilters({ ...filters, maLoai: opt?.value })}
                placeholder="-- Chọn loại --"
                styles={customStyles}
            />
          </div>

          {/* 3. Lọc theo Nhà cung cấp */}
          <div className="col-12 col-md-4">
            <label className="form-label small text-muted mb-1 d-block">Nhà cung cấp</label>
            <Select 
                options={nccOptions}
                value={getValueObj(nccOptions, filters.maNCC)}
                onChange={(opt) => setFilters({ ...filters, maNCC: opt?.value })}
                placeholder="-- Chọn NCC --"
                styles={customStyles}
            />
          </div>

          {/* 4. Nút Reset */}
          <div className="col-12 col-md-2">
            <button className="btn btn-light border w-100 text-muted" onClick={resetFilters} title="Xóa bộ lọc">
              <X size={18} /> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}