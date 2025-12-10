import { useState, useEffect } from "react";
import { equipmentService } from "../../services/equipmentService";
import axiosInstance from "../../api/axiosInstance"; 
import toast from "react-hot-toast";
import Select from "react-select"; // 👇 Import thư viện

export default function EquipmentCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State chứa options cho React-Select
  const [loaiOptions, setLoaiOptions] = useState([]);
  const [phongOptions, setPhongOptions] = useState([]);

  // Options cứng cho trạng thái
  const trangThaiOptions = [
    { value: "Đang sử dụng", label: "Đang sử dụng" },
    { value: "Sẵn sàng", label: "Sẵn sàng" },
    { value: "Bảo trì", label: "Bảo trì" },
    { value: "Hỏng hóc", label: "Hỏng hóc" },
    { value: "Chờ thanh lý", label: "Chờ thanh lý" }
  ];

  const [form, setForm] = useState({
    ten_tb: "",
    ma_loai: null, // React-Select dùng null
    ma_lo: null,
    ma_phong: null, // React-Select dùng null
    gia_tri_ban_dau: "",
    tinh_trang: "Đang sử dụng", // Mặc định chuỗi (vì convert lúc render)
    ngay_su_dung: new Date().toISOString().split("T")[0],
  });

  // GỌI API KHI MỞ MODAL
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("openCreateEquipmentModal", handler);
    
    // Gọi API lấy danh mục
    fetchMasterData(); 

    return () => window.removeEventListener("openCreateEquipmentModal", handler);
  }, []);

  const fetchMasterData = async () => {
    try {
      const [resPhong, resLoai] = await Promise.all([
        axiosInstance.get("/api/phong"),
        axiosInstance.get("/api/loai_thiet_bi")
      ]);

      // Convert Phong -> Options
      const rawPhong = resPhong.data.result || resPhong.data || [];
      setPhongOptions(rawPhong.map(p => ({ value: p.maPhong, label: p.tenPhong })));

      // Convert Loai -> Options
      const rawLoai = resLoai.data.result || resLoai.data || [];
      setLoaiOptions(rawLoai.map(l => ({ value: l.maLoai, label: l.tenLoai })));

    } catch (error) {
      console.error("Lỗi tải dữ liệu danh mục:", error);
      toast.error("Không thể tải danh sách danh mục");
    }
  };

  const handleSubmit = async () => {
    const missingFields = [];
    if (!form.ten_tb.trim()) missingFields.push("Tên thiết bị");
    if (!form.ma_loai) missingFields.push("Loại thiết bị");
    if (!form.ma_phong) missingFields.push("Phòng");
    if (!form.gia_tri_ban_dau || Number(form.gia_tri_ban_dau) <= 0) missingFields.push("Nguyên giá");

    if (missingFields.length > 0) {
      toast.error(`Vui lòng nhập đầy đủ: ${missingFields.join(", ")}`);
      return;
    }

    const payload = {
      ten_tb: form.ten_tb.trim(),
      ma_loai: form.ma_loai, // Gửi value (ID)
      ma_lo: form.ma_lo || null,
      ma_phong: form.ma_phong, // Gửi value (ID)
      tinh_trang: form.tinh_trang,
      gia_tri_ban_dau: Number(form.gia_tri_ban_dau),
      gia_tri_hien_tai: Number(form.gia_tri_ban_dau),
      ngay_su_dung: form.ngay_su_dung,
    };
      
    setLoading(true);
    try {
      await equipmentService.create(payload);
      toast.success("Thêm thiết bị thành công!");
      setIsOpen(false);
      
      // Reset form
      setForm({
        ten_tb: "", ma_loai: null, ma_phong: null, 
        gia_tri_ban_dau: "", tinh_trang: "Đang sử dụng", 
        ngay_su_dung: new Date().toISOString().split("T")[0]
      });
      
      // Reload bảng
      window.dispatchEvent(new Event("reloadEquipmentTable")); 
      
    } catch (err) {
      console.error(err);
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Helper tìm Object từ ID (Để hiển thị lên React-Select)
  const getValueObj = (options, value) => {
      return options.find(op => op.value === value) || null;
  };

  // Style giống Bootstrap
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#dee2e6",
      borderRadius: "0.375rem",
      minHeight: "38px",
      boxShadow: "none",
      "&:hover": { borderColor: "#86b7fe" }
    }),
    menu: (base) => ({ ...base, zIndex: 1060 })
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">Thêm thiết bị mới</h5>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              
              {/* Tên thiết bị */}
              <div className="col-12">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Tên thiết bị</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: PC Dell Optiplex i7"
                  value={form.ten_tb}
                  onChange={(e) => setForm({ ...form, ten_tb: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Loại thiết bị (React-Select) */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Loại thiết bị</label>
                <Select 
                    options={loaiOptions}
                    value={getValueObj(loaiOptions, form.ma_loai)}
                    onChange={(opt) => setForm({ ...form, ma_loai: opt?.value })}
                    placeholder="-- Chọn loại --"
                    styles={customStyles}
                    isDisabled={loading}
                    noOptionsMessage={() => "Không tìm thấy loại"}
                />
              </div>

              {/* Phòng đặt (React-Select) */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Phòng đặt</label>
                <Select 
                    options={phongOptions}
                    value={getValueObj(phongOptions, form.ma_phong)}
                    onChange={(opt) => setForm({ ...form, ma_phong: opt?.value })}
                    placeholder="-- Tìm phòng --"
                    styles={customStyles}
                    isDisabled={loading}
                    noOptionsMessage={() => "Không tìm thấy phòng"}
                />
              </div>

              {/* Nguyên giá */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold"><span className="text-danger">*</span> Nguyên giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="VD: 18500000"
                  value={form.gia_tri_ban_dau}
                  onChange={(e) => setForm({ ...form, gia_tri_ban_dau: e.target.value })}
                  min="0"
                  disabled={loading}
                />
              </div>

              {/* Trạng thái (React-Select) */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Trạng thái ban đầu</label>
                <Select 
                    options={trangThaiOptions}
                    // Mặc định "Đang sử dụng" nếu null
                    value={getValueObj(trangThaiOptions, form.tinh_trang) || trangThaiOptions[0]}
                    onChange={(opt) => setForm({ ...form, tinh_trang: opt?.value })}
                    placeholder="-- Trạng thái --"
                    styles={customStyles}
                    isDisabled={loading}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Hủy
            </button>
            <button className="btn bg-primary text-white fw-bold" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : "Thêm thiết bị"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}