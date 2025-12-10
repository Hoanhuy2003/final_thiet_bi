import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react"; 
import axiosInstance from "../../api/axiosInstance";
import Select from "react-select"; 

export default function UserFilters() {
  
  // Options cho Select
  const trangThaiOptions = [
    { value: "HOAT_DONG", label: "Hoạt động" },
    { value: "KHOA", label: "Đã khóa" },
    { value: "CHO_DUYET", label: "Chờ duyệt" },
  ];

  const [roleOptions, setRoleOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  // 1. STATE BỘ LỌC (Khởi tạo từ localStorage)
  const [filters, setFilters] = useState(() => {
    try {
        const savedFilters = localStorage.getItem("userFilters");
        return savedFilters ? JSON.parse(savedFilters) : { search: "", vaiTro: null, donVi: null, trangThai: null };
    } catch (e) {
        return { search: "", vaiTro: null, donVi: null, trangThai: null };
    }
  });

  // 2. LOAD DATA DANH MỤC (Vai trò, Đơn vị)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load Vai trò
        const resRole = await axiosInstance.get("/api/roles");
        const roles = resRole.data?.result || resRole.data || [];
        setRoleOptions(roles.map(r => ({ value: r.ma_vai_tro, label: r.ten_vai_tro })));

        // Load Đơn vị
        const resUnit = await axiosInstance.get("/api/donVi");
        const units = resUnit.data?.result || resUnit.data || [];
        setUnitOptions(units.map(u => ({ value: u.maDonVi, label: u.tenDonVi })));
      } catch (error) {
        console.error("Lỗi tải danh mục lọc:", error);
      }
    };
    fetchData();
  }, []);

  // 3. LƯU LOCAL STORAGE & BẮN SỰ KIỆN
  useEffect(() => {
    localStorage.setItem("userFilters", JSON.stringify(filters));
    window.dispatchEvent(new Event("userFilterChange"));
  }, [filters]);

  // Helper cho React-Select
  const getValueObj = (options, value) => {
      if (!value) return null;
      return options.find(op => op.value === value) || null;
  };

  const handleSelectChange = (name, option) => {
    const value = option ? option.value : null;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setFilters({ search: "", vaiTro: null, donVi: null, trangThai: null });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#dee2e6", 
      borderRadius: "0.375rem",
      minHeight: "38px",
      boxShadow: "none",
      "&:hover": { borderColor: "#86b7fe" } 
    }),
    menu: (base) => ({ ...base, zIndex: 1050 }), 
    placeholder: (base) => ({ ...base, color: "#6c757d" }) 
  };

  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 d-flex align-items-center gap-2 text-primary fw-bold">
          <Filter size={20} /> Bộ lọc người dùng
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          
          {/* Tìm kiếm từ khóa */}
          <div className="col-12 col-md-3">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tên, Email, Username..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Lọc Vai trò */}
          <div className="col-12 col-md-3">
            <Select 
                options={roleOptions}
                value={getValueObj(roleOptions, filters.vaiTro)}
                onChange={(option) => handleSelectChange('vaiTro', option)}
                placeholder="-- Vai trò --"
                isClearable
                styles={customStyles}
            />
          </div>

          {/* Lọc Đơn vị */}
          <div className="col-12 col-md-3">
            <Select 
                options={unitOptions}
                value={getValueObj(unitOptions, filters.donVi)}
                onChange={(option) => handleSelectChange('donVi', option)}
                placeholder="-- Đơn vị --"
                isClearable
                styles={customStyles}
            />
          </div>

          {/* Lọc Trạng thái */}
          <div className="col-12 col-md-2">
            <Select 
                options={trangThaiOptions}
                value={getValueObj(trangThaiOptions, filters.trangThai)}
                onChange={(option) => handleSelectChange('trangThai', option)}
                placeholder="-- Trạng thái --"
                isClearable
                styles={customStyles}
            />
          </div>

          {/* Nút Reset */}
          <div className="col-12 col-md-1 d-flex align-items-end">
            <button className="btn btn-light border w-100 text-muted" onClick={reset} title="Xóa bộ lọc">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}