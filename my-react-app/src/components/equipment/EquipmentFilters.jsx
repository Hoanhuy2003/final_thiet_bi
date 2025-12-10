import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react"; 
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast"; 
import Select from "react-select"; 

export default function EquipmentFilters() {
  
  // 1. STATE BỘ LỌC
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("equipmentFilters");
    // Sửa: Khởi tạo với giá trị string (mã) hoặc null
    if (savedFilters) return JSON.parse(savedFilters);
    return { search: "", loai: null, tinhTrang: null, phong: null }; 
  });

  // 2. STATE DANH MỤC (Dạng options cho React-Select)
  const [loaiOptions, setLoaiOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]);

  const tinhTrangOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" },
    { value: "Sẵn sàng", label: "Sẵn sàng" },
    { value: "Bảo trì", label: "Bảo trì" },
    { value: "Hỏng hóc", label: "Hỏng hóc" },
    { value: "Chờ thanh lý", label: "Chờ thanh lý" },
    { value: "Đã thanh lý", label: "Đã thanh lý" }
  ];

  // 3. LOAD DATA API (Lưu Mã/ID)
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resLoai, resPhong] = await Promise.all([
          axiosInstance.get("/api/loai_thiet_bi"),
          axiosInstance.get("/api/phong")
        ]);

        // FIX: LƯU MÃ (maLoai) VÀO VALUE
        const rawLoai = resLoai.data.result || resLoai.data || [];
        setLoaiOptions(rawLoai.map(item => ({ 
            value: item.maLoai, // <-- SỬ DỤNG MÃ
            label: item.tenLoai 
        })));

        // FIX: LƯU MÃ (maPhong) VÀO VALUE
        const rawPhong = resPhong.data.result || resPhong.data || [];
        setPhongOptions(rawPhong.map(item => ({ 
            value: item.maPhong, // <-- SỬ DỤNG MÃ
            label: item.tenPhong 
        })));
        
      } catch (error) {
        console.error("Lỗi tải bộ lọc:", error);
      }
    };
    fetchMasterData();
  }, []);

  // 4. LƯU LOCAL STORAGE
  useEffect(() => {
    // Khi lưu, ta chỉ lưu Mã/Value (string) hoặc "all"
    const filtersToSave = {
        search: filters.search,
        loai: filters.loai || "all", // Chuyển null thành "all"
        tinhTrang: filters.tinhTrang || "all",
        phong: filters.phong || "all"
    };

    localStorage.setItem("equipmentFilters", JSON.stringify(filtersToSave));
    window.dispatchEvent(new Event("equipmentFilterChange"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // 5. RESET
  const reset = () => {
    // Sửa: Reset về null (sẽ được useEffect chuyển thành "all" khi lưu)
    setFilters({ search: "", loai: null, tinhTrang: null, phong: null });
    toast.success("Đã xóa bộ lọc");
  };

  // 6. HÀM TÌM OBJECT TỪ STRING (Để hiển thị lên Select) 
   // Hàm này tìm Object {value, label} từ giá trị string (là Mã/ID)
  const getValueObj = (options, value) => {
      if (!value) return null;
      // Sửa: Tìm kiếm theo value (Mã/ID)
      return options.find(op => op.value === value) || null;
  };

  // 7. HÀM HANDLE CHANGE CHUẨN CHO SELECT
   // Hàm này chỉ lấy value (Mã/ID) từ option và lưu vào state
  const handleSelectChange = (name, option) => {
    const value = option ? option.value : null;
    setFilters(prev => ({ ...prev, [name]: value }));
  };


  const customStyles = {
    // ... (giữ nguyên styles)
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
          <Filter size={20} /> Bộ lọc tìm kiếm
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          
          {/* Tìm kiếm từ khóa */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="position-relative">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm mã hoặc tên..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Lọc theo Loại (Gửi Mã/ID) */}
          <div className="col-12 col-md-6 col-lg-3">
            <Select 
                options={loaiOptions}
                value={getValueObj(loaiOptions, filters.loai)} // Hiển thị Object từ Mã
                onChange={(option) => handleSelectChange('loai', option)} // Lưu Mã vào state
                placeholder="-- Chọn loại --"
                isClearable 
                styles={customStyles}
                noOptionsMessage={() => "Không tìm thấy loại"}
            />
          </div>

          {/* Lọc theo Trạng thái (Gửi Tên) */}
          <div className="col-12 col-md-6 col-lg-2">
            <Select 
                options={tinhTrangOptions}
                value={getValueObj(tinhTrangOptions, filters.tinhTrang)}
                onChange={(option) => handleSelectChange('tinhTrang', option)}
                placeholder="-- Trạng thái --"
                isClearable
                styles={customStyles}
            />
          </div>

          {/* Lọc theo Phòng (Gửi Mã/ID) */}
          <div className="col-12 col-md-6 col-lg-3">
            <Select 
                options={phongOptions}
                value={getValueObj(phongOptions, filters.phong)}
                onChange={(option) => handleSelectChange('phong', option)}
                placeholder="-- Chọn phòng --"
                isClearable
                styles={customStyles}
                noOptionsMessage={() => "Không tìm thấy phòng"}
            />
          </div>

          {/* Nút Reset */}
          <div className="col-12 col-md-6 col-lg-1 d-flex align-items-end">
            <button className="btn btn-light border w-100 text-muted" onClick={reset} title="Xóa bộ lọc">
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Nút Apply (Dùng cho debug/test, hiện tại tự động chạy qua useEffect) */}
        {/* <div className="mt-3 text-end">
            <button className="btn btn-primary" onClick={() => window.dispatchEvent(new Event("equipmentFilterChange"))}>Áp dụng Bộ lọc</button>
        </div> */}
      </div>
    </div>
  );
}