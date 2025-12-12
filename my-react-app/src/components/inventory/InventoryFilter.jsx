import React, { useState, useEffect, useRef } from "react";
import Select from "react-select"; 
import { Search, X, Filter } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";

// Option cứng cho Trạng thái
const STATUS_OPTIONS = [
  { value: "Mới tạo", label: "Mới tạo" },
  { value: "Đang kiểm kê", label: "Đang kiểm kê" },
  { value: "Hoàn thành", label: "Hoàn thành" },
];

export default function InventoryFilter({ onFilterApply }) {
  // 1. KHỞI TẠO STATE TỪ LOCAL STORAGE (Để F5 không mất)
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("inventoryFilters");
    // Nếu có lưu thì lấy ra, không thì để rỗng
    return saved ? JSON.parse(saved) : { keyword: "", room: null, status: null };
  });

  const [roomOptions, setRoomOptions] = useState([]);
  const isFirstRun = useRef(true); // Dùng để chặn chạy effect lần đầu tiên nếu muốn

  // 2. LOAD DANH SÁCH PHÒNG (Dùng service của bạn)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await inventoryService.getAllRooms();
        const options = rooms.map(r => ({
            value: r.maPhong,
            label: `${r.tenPhong} (${r.maPhong})` 
        }));
        setRoomOptions(options);
      } catch (error) {
        console.error("Lỗi load phòng:", error);
      }
    };
    fetchRooms();
  }, []);

  // 3. XỬ LÝ LƯU LOCAL STORAGE & GỌI HÀM LỌC
  useEffect(() => {
    // Lưu vào LocalStorage
    localStorage.setItem("inventoryFilters", JSON.stringify(filters));

    // Kỹ thuật Debounce: Chờ người dùng gõ xong 500ms mới gọi lọc (để đỡ spam API)
    const timeoutId = setTimeout(() => {
      onFilterApply({
        keyword: filters.keyword,
        maPhong: filters.room ? filters.room.value : "",
        trangThai: filters.status ? filters.status.value : ""
      });
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); 

  // 4. CÁC HÀM XỬ LÝ
  const handleReset = () => {
    setFilters({ keyword: "", room: null, status: null });
  };

  // Style cho Select để nhìn nó "khôn" hơn (giống Input Bootstrap)
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '38px',
      borderColor: '#dee2e6',
      borderRadius: '0.375rem',
      boxShadow: 'none',
      '&:hover': { borderColor: '#86b7fe' } 
    }),
    menu: (base) => ({ ...base, zIndex: 1050 }),
    placeholder: (base) => ({ ...base, color: '#6c757d' })
  };

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body bg-light rounded">
        <div className="row g-3">
            
            {/* --- 1. TÌM KIẾM --- */}
            <div className="col-12 col-md-4">
                <label className="form-label text-muted small fw-bold mb-1">Từ khóa</label>
                <div className="position-relative">
                    <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                    <input 
                        type="text" 
                        className="form-control ps-5" 
                        placeholder="Tìm mã phiếu, tên..." 
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                </div>
            </div>

            {/* --- 2. CHỌN PHÒNG --- */}
            <div className="col-12 col-md-3">
                <label className="form-label text-muted small fw-bold mb-1">Phòng</label>
                <Select
                    options={roomOptions}
                    value={filters.room}
                    onChange={(opt) => setFilters({ ...filters, room: opt })}
                    placeholder="-- Tất cả --"
                    isClearable
                    styles={customStyles}
                    noOptionsMessage={() => "Không tìm thấy phòng"}
                />
            </div>

            {/* --- 3. TRẠNG THÁI --- */}
            <div className="col-12 col-md-3">
                <label className="form-label text-muted small fw-bold mb-1">Trạng thái</label>
                <Select
                    options={STATUS_OPTIONS}
                    value={filters.status}
                    onChange={(opt) => setFilters({ ...filters, status: opt })}
                    placeholder="-- Tất cả --"
                    isClearable
                    styles={customStyles}
                />
            </div>

            {/* --- 4. NÚT RESET --- */}
            <div className="col-12 col-md-2 d-flex align-items-end">
                <button 
                    className="btn btn-white border w-100 text-danger d-flex align-items-center justify-content-center gap-2" 
                    onClick={handleReset}
                    title="Xóa bộ lọc"
                >
                    <X size={18} /> Xóa lọc
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}