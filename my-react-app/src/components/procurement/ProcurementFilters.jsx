import { useState, useEffect, useMemo } from "react";
import { Search, Filter, X } from "lucide-react"; 
import axiosInstance from "../../api/axiosInstance";
import Select from "react-select"; 

export default function ProcurementFilters() {
  
  // Trạng thái cho Select (Phải khớp với statusColors trong ProcurementTable.jsx)
  const trangThaiOptions = [
    { value: "Chờ duyệt", label: "Chờ duyệt" },
    { value: "Đã duyệt", label: "Đã duyệt" },
    { value: "Từ chối", label: "Từ chối" },

  ];

  // State Người dùng (để lọc theo Người đề xuất)
  const [userOptions, setUserOptions] = useState([]);

  // 1. STATE BỘ LỌC (Khởi tạo từ localStorage)
  const [filters, setFilters] = useState(() => {
    try {
        const savedFilters = localStorage.getItem("procurementFilters");
        if (savedFilters) return JSON.parse(savedFilters);
    } catch (e) {
        console.error("Lỗi tải filter DX:", e);
    }
    // Giá trị mặc định: search rỗng, các trường Select là null
    return { search: "", trangThai: null, nguoiTao: null }; 
  });

  // 2. LOAD DATA API (Lấy danh sách người dùng để lọc)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // API lấy danh sách người dùng (Giả định endpoint là /api/nguoi_dung)
        const resUser = await axiosInstance.get("/api/nguoi_dung"); 

        const rawUsers = resUser.data.result || resUser.data || [];
        // Lưu Mã Người dùng (maND) vào value để Backend dễ lọc
        setUserOptions(rawUsers.map(u => ({ 
            value: u.maND, 
            label: u.tenND 
        })));
        
      } catch (error) {
        console.error("Lỗi tải danh mục người dùng:", error);
      }
    };
    fetchUsers();
  }, []);

  // 3. LƯU LOCAL STORAGE & BẮN SỰ KIỆN (Để ProcurementTable load lại)
  useEffect(() => {
    // Lưu filters (chứa Mã/ID hoặc null)
    localStorage.setItem("procurementFilters", JSON.stringify(filters));
    
    // Bắn sự kiện để ProcurementTable load lại dữ liệu
    window.dispatchEvent(new Event("procurementFilterChange"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // 4. HÀM TÌM OBJECT TỪ STRING/ID (Để hiển thị lên Select) 
  const getValueObj = (options, value) => {
      if (!value) return null;
      return options.find(op => op.value === value) || null;
  };

  // 5. HÀM HANDLE CHANGE CHUẨN CHO SELECT
  const handleSelectChange = (name, option) => {
    // Lưu value (Mã/ID) vào state, nếu không chọn thì là null
    const value = option ? option.value : null;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setFilters({ search: "", trangThai: null, nguoiTao: null });
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
          <Filter size={20} /> Bộ lọc đề xuất
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          
          {/* Tìm kiếm từ khóa */}
          <div className="col-12 col-md-8">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm mã, tiêu đề, hoặc nội dung..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Lọc Trạng thái */}
          <div className="col-12 col-md-3">
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